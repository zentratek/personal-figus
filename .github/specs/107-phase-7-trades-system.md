# Phase 7: Sistema de Intercambios (Trades System)

**Status**: Planning
**Priority**: High
**Estimated effort**: 6-8 hours
**Prerequisite**: Phase 6 (Groups System) must be completed first

## Overview
Implementar un sistema completo de intercambios de figuritas **entre miembros del mismo grupo**, permitiendo:
- Descubrir miembros del grupo con figuritas compatibles
- Ver qué figuritas necesitan otros miembros que vos tenés repetidas
- Proponer, enviar, recibir, aceptar y rechazar intercambios
- Notificaciones de nuevos matches y propuestas **dentro del grupo**

## User Stories
- Como miembro de un grupo, quiero ver qué otros miembros tienen figuritas que necesito
- Como miembro de un grupo, quiero ver qué otros miembros necesitan figuritas que tengo repetidas
- Como usuario, quiero proponer un intercambio específico (1x1, 2x2, etc.)
- Como usuario, quiero recibir notificaciones de propuestas de intercambio
- Como usuario, quiero aceptar o rechazar propuestas
- Como usuario, quiero marcar figuritas como "en intercambio" para evitar duplicar propuestas
- Como usuario, quiero ver el historial de mis intercambios completados

## Requirements

### 1. Firestore Collections

#### Collection: `users`
Información básica de usuarios visible para matching:
```javascript
{
  uid: string,
  displayName: string,
  email: string,
  photoURL: string,
  createdAt: Timestamp,
  lastActive: Timestamp,
  stats: {
    needed: number,
    owned: number,
    repeated: number,
    completionPct: number
  },
  preferences: {
    allowTradeRequests: boolean, // default true
    notifyOnMatches: boolean // default true
  }
}
```

#### Collection: `trades`
Propuestas de intercambio entre usuarios:
```javascript
{
  id: string (auto-generated),
  fromUserId: string,
  fromUserName: string,
  toUserId: string,
  toUserName: string,
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed',

  // Stickers being offered/requested
  offering: [
    {
      stickerId: string, // e.g., "ARG-001"
      number: number,
      playerName: string,
      teamName: string,
      flagCode: string
    }
  ],
  requesting: [
    {
      stickerId: string,
      number: number,
      playerName: string,
      teamName: string,
      flagCode: string
    }
  ],

  message: string (optional),
  createdAt: Timestamp,
  updatedAt: Timestamp,
  acceptedAt: Timestamp (nullable),
  completedAt: Timestamp (nullable)
}
```

#### Collection: `friendships` (Future - Phase 8)
Para grupos de amigos y notificaciones:
```javascript
{
  userId: string,
  friendId: string,
  status: 'pending' | 'accepted',
  createdAt: Timestamp
}
```

### 2. Matching Algorithm

**Goal**: Find users where:
1. They have stickers I need AND are marked as "repeated"
2. I have stickers they need AND are marked as "repeated"

**Algorithm**:
```javascript
// Pseudo-code
function findMatches(currentUser, groupMembers) {
  const myNeeded = currentUser.stickers.filter(s => s.status === 'needed')
  const myRepeated = currentUser.stickers.filter(s => s.status === 'repeated')

  const matches = []

  // Only check members from the same group
  for (const otherUser of groupMembers) {
    if (otherUser.uid === currentUser.uid) continue

    const theirRepeated = otherUser.stickers.filter(s => s.status === 'repeated')
    const theirNeeded = otherUser.stickers.filter(s => s.status === 'needed')

    // Find stickers they have that I need
    const theyHaveThatINeed = theirRepeated.filter(s =>
      myNeeded.some(n => n.stickerId === s.stickerId)
    )

    // Find stickers I have that they need
    const iHaveThatTheyNeed = myRepeated.filter(s =>
      theirNeeded.some(n => n.stickerId === s.stickerId)
    )

    if (theyHaveThatINeed.length > 0 && iHaveThatTheyNeed.length > 0) {
      matches.push({
        user: otherUser,
        theyHave: theyHaveThatINeed,
        iHave: iHaveThatTheyNeed,
        score: theyHaveThatINeed.length + iHaveThatTheyNeed.length
      })
    }
  }

  // Sort by score (most compatible first)
  return matches.sort((a, b) => b.score - a.score)
}
```

**Optimization**:
- Cache user stats in `users` collection to avoid loading all stickers
- **Filter by groupId first**: Only load stickers from group members
- Run matching algorithm client-side for Phase 7
- Much more efficient than scanning all users (only checking 5-20 people)
- Future: Move to Cloud Functions for scalability

### 3. Screens & Components

#### TradesScreen (`src/screens/TradesScreen.jsx`)

**Sections**:

1. **Header Stats**:
   - "X usuarios disponibles para intercambiar"
   - "Y figuritas en común"

2. **Tabs**:
   - "Matches" (default) - Users with compatible stickers
   - "Mis Propuestas" - Trades I initiated
   - "Recibidas" - Trades others proposed to me
   - "Historial" - Completed trades

3. **Match List** (Tab: Matches):
   - User card showing:
     - Avatar, name
     - Stats: "Tiene X que necesitás • Necesita Y que tenés"
     - Primary action: "Ver Detalles →"
   - Sorted by match score (most compatible first)
   - Empty state: "No hay matches disponibles aún"

4. **My Proposals** (Tab: Mis Propuestas):
   - List of trades I created
   - Status badge: pending/accepted/rejected/cancelled
   - Action: "Ver Propuesta" or "Cancelar" (if pending)

5. **Received** (Tab: Recibidas):
   - List of trades others sent me
   - Status badge: pending/accepted/rejected
   - Actions: "Aceptar" / "Rechazar" (if pending)
   - Highlight with notification badge

6. **History** (Tab: Historial):
   - Completed trades with date
   - Show what was exchanged

#### MatchDetailModal (`src/components/trades/MatchDetailModal.jsx`)

**Purpose**: Show detailed comparison between two users

**Layout**:
- Header: Other user's info (name, avatar, stats)
- Two columns:
  - Left: "Tienen para vos" (stickers they have repeated that I need)
  - Right: "Necesitan de vos" (stickers they need that I have repeated)
- Action: "Proponer Intercambio" button

#### TradeProposalModal (`src/components/trades/TradeProposalModal.jsx`)

**Purpose**: Create a new trade proposal

**Features**:
- Multi-select stickers from "I have" list
- Multi-select stickers from "They have" list
- Optional message field
- Summary: "Ofreciendo X figuritas por Y figuritas"
- Action: "Enviar Propuesta"

**Validation**:
- Must select at least 1 sticker from each side
- Can't select more than user has available
- Check stickers aren't already in pending trades

#### TradeDetailModal (`src/components/trades/TradeDetailModal.jsx`)

**Purpose**: View an existing trade proposal

**Layout**:
- Header: Trade status badge
- From/To user info
- Two columns:
  - "Ofrecen" (stickers being offered)
  - "Solicitan" (stickers being requested)
- Message (if any)
- Actions based on status:
  - **Pending (received)**: "Aceptar" / "Rechazar"
  - **Pending (sent)**: "Cancelar Propuesta"
  - **Accepted**: "Marcar como Completado" (both users)
  - **Rejected/Cancelled**: Read-only
  - **Completed**: Read-only with completion date

### 4. Services

#### `tradeService.js`

```javascript
// Get all users (for matching)
export const getAllUsers = async () => { ... }

// Find matches for current user
export const findMatches = async (currentUserId) => { ... }

// Create trade proposal
export const createTrade = async (fromUserId, toUserId, offering, requesting, message) => { ... }

// Get trades by user (sent or received)
export const getUserTrades = async (userId, type = 'all') => { ... }
// type: 'sent' | 'received' | 'all'

// Update trade status
export const updateTradeStatus = async (tradeId, newStatus) => { ... }

// Cancel trade
export const cancelTrade = async (tradeId, userId) => { ... }

// Mark trade as completed
export const completeTrade = async (tradeId, userId) => { ... }
// Both users must mark as completed, then update sticker statuses
```

#### `userService.js` (new)

```javascript
// Create/update user profile
export const createOrUpdateUserProfile = async (uid, data) => { ... }

// Get user profile
export const getUserProfile = async (uid) => { ... }

// Update user stats (called after sticker changes)
export const updateUserStats = async (uid, stats) => { ... }

// Update last active timestamp
export const updateLastActive = async (uid) => { ... }
```

### 5. Trade Flow

#### **Creating a Trade Proposal**:
1. User browses matches in TradesScreen
2. Clicks "Ver Detalles" on a match
3. MatchDetailModal opens showing compatible stickers
4. Clicks "Proponer Intercambio"
5. TradeProposalModal opens
6. Selects stickers from both sides
7. Optionally adds message
8. Clicks "Enviar Propuesta"
9. Trade document created in Firestore with status='pending'
10. Notification sent to recipient (future: push notification)

#### **Receiving a Trade Proposal**:
1. Recipient sees badge on "Recibidas" tab
2. Opens TradesScreen → "Recibidas" tab
3. Clicks on pending trade
4. TradeDetailModal opens
5. Reviews proposal
6. Clicks "Aceptar" or "Rechazar"
7. Trade status updated in Firestore
8. If accepted: Both users notified

#### **Completing a Trade**:
1. Both users meet in person and exchange stickers
2. Each user opens the accepted trade
3. Clicks "Marcar como Completado"
4. When both mark complete:
   - Trade status → 'completed'
   - Sticker statuses updated:
     - Offering stickers: decrement count or change status
     - Requesting stickers: change status to 'owned'
5. Stats recalculated for both users

### 6. Update Existing Components

#### MatchesCard (`src/components/home/MatchesCard.jsx`)
- Replace placeholder with real data
- Show count of current matches
- Navigate to TradesScreen on click
- Show "0 matches" if no compatible users

#### BottomNav
- Add notification badge on "Cambios" icon when there are pending received trades

### 7. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection - readable by all authenticated users
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Trades collection
    match /trades/{tradeId} {
      // Can read if you're part of the trade
      allow read: if request.auth != null && (
        resource.data.fromUserId == request.auth.uid ||
        resource.data.toUserId == request.auth.uid
      );

      // Can create if you're the sender
      allow create: if request.auth != null &&
        request.resource.data.fromUserId == request.auth.uid;

      // Can update if you're part of the trade
      allow update: if request.auth != null && (
        resource.data.fromUserId == request.auth.uid ||
        resource.data.toUserId == request.auth.uid
      );

      // Can't delete trades
      allow delete: if false;
    }

    // Stickers collection - same as before
    match /stickers/{stickerId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

### 8. UI/UX Considerations

**Design System** (cyberpunk theme):
- Match cards: var(--surface-2) with border
- Status badges:
  - Pending: var(--gold)
  - Accepted: var(--cyan)
  - Rejected: var(--red)
  - Completed: var(--lime)
  - Cancelled: var(--muted)
- Trade proposal button: var(--primary) with shadow
- Sticker selection: checkbox with lime accent

**Loading States**:
- Show skeleton while loading matches
- Show spinner while creating trade
- Optimistic updates for better UX

**Error Handling**:
- "No se pudo cargar matches. Intenta de nuevo."
- "Error al enviar propuesta. Verifica tu conexión."
- "Este intercambio ya no está disponible."

**Empty States**:
- No matches: "Aún no hay usuarios con figuritas compatibles. ¡Sigue cargando tu álbum!"
- No proposals: "No tenés propuestas pendientes."
- No history: "Aún no completaste ningún intercambio."

### 9. Testing Scenarios

1. **Create multiple test users**:
   - User A: needs ARG-001, has BRA-005 (repeated)
   - User B: has ARG-001 (repeated), needs BRA-005
   - Should show as match

2. **Test trade flow**:
   - A proposes trade: BRA-005 for ARG-001
   - B receives notification
   - B accepts trade
   - Both mark as completed
   - Verify sticker statuses updated

3. **Edge cases**:
   - User tries to trade sticker they no longer have
   - User tries to trade sticker already in pending trade
   - Both users try to propose same trade simultaneously
   - User cancels trade after other accepts

### 10. Future Enhancements (Phase 7+)

- **Push Notifications**: Notify users of new matches and proposals
- **Chat System**: Allow negotiation before formal proposal
- **Trade History Analytics**: Show stats like "25 intercambios completados"
- **Trade Ratings**: Users rate each other after completed trades
- **Group Trades**: 3+ users can participate in complex trades
- **Auto-matching**: System suggests optimal trades automatically
- **QR Code Trades**: Scan QR to instantly propose trade in person

## Acceptance Criteria

- [ ] Users collection populated with basic user data
- [ ] Matching algorithm finds compatible users correctly
- [ ] TradesScreen shows list of matches sorted by compatibility
- [ ] MatchDetailModal shows detailed comparison
- [ ] TradeProposalModal allows creating proposals
- [ ] Trade proposals saved to Firestore with status='pending'
- [ ] Recipient can view received proposals in "Recibidas" tab
- [ ] Recipient can accept/reject proposals
- [ ] Both users can mark accepted trades as completed
- [ ] Sticker statuses update correctly after trade completion
- [ ] MatchesCard on HomeScreen shows real match count
- [ ] Empty states for all sections
- [ ] Loading states while fetching data
- [ ] Error handling for failed operations
- [ ] Mobile-responsive design matching cyberpunk theme

## Estimated Time Breakdown

1. Design Firestore schema and security rules: 1 hour
2. Implement userService and tradeService: 1.5 hours
3. Implement matching algorithm: 1 hour
4. Create TradesScreen with tabs: 1.5 hours
5. Create MatchDetailModal: 1 hour
6. Create TradeProposalModal: 1.5 hours
7. Create TradeDetailModal: 1 hour
8. Update MatchesCard with real data: 0.5 hours
9. Testing and debugging: 1.5 hours
10. UI polish and refinement: 1 hour

**Total**: ~11 hours (split across multiple sessions)

## Implementation Plan (Phased)

### Phase 6.1: Core Matching (3-4 hours)
- Set up users collection
- Implement matching algorithm
- Create TradesScreen with match list
- Update MatchesCard

### Phase 6.2: Trade Proposals (3-4 hours)
- Implement trade creation
- Create TradeProposalModal
- Add "Mis Propuestas" and "Recibidas" tabs

### Phase 6.3: Trade Management (3-4 hours)
- Implement accept/reject/cancel
- Implement trade completion
- Update sticker statuses after completion
- Add "Historial" tab

## Dependencies

- Existing: calculateStats() from mockData.js
- Existing: getUserStickers() from stickerService.js
- Existing: updateStickerStatus() from stickerService.js
- New: userService.js
- New: tradeService.js
- Firestore security rules update

## Notes

- Start with Phase 6.1 (Core Matching) as it provides immediate value
- Test with at least 2 real user accounts
- Consider rate limiting to prevent spam proposals
- Monitor Firestore read/write costs as matching can be expensive
