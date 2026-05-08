# Phase 6: Sistema de Grupos (Groups & Friends)

**Status**: Planning
**Priority**: High (prerequisite for trades)
**Estimated effort**: 4-5 hours

## Overview
Implementar un sistema de grupos para que los usuarios puedan crear o unirse a grupos privados de amigos. Los intercambios de figuritas solo ocurrirán dentro de estos grupos, garantizando privacidad y seguridad.

## User Stories
- Como usuario, quiero crear un grupo con mis amigos
- Como usuario, quiero invitar amigos a mi grupo con un código simple
- Como usuario, quiero unirme a un grupo usando un código de invitación
- Como usuario, quiero ver los miembros de mi grupo y sus estadísticas
- Como usuario, quiero ver el progreso colectivo de mi grupo
- Como usuario, quiero tener un solo grupo activo a la vez (simplificación inicial)

## Key Design Decisions

### **Grupos Privados** (no públicos)
- No hay búsqueda de grupos
- Solo se puede unir con código de invitación
- Privacidad garantizada entre amigos

### **Un Grupo por Usuario** (Phase 6)
- Simplificación: cada usuario pertenece a un solo grupo
- Future: permitir múltiples grupos (Phase 8+)

### **Códigos de Invitación**
- Formato: `XXXX-XXXX` (8 caracteres alfanuméricos)
- Ejemplo: `PB94-K7M2`, `FIGS-2026`
- Fácil de compartir por WhatsApp/SMS

## Requirements

### 1. Firestore Collections

#### Collection: `groups`
```javascript
{
  id: string (auto-generated),
  name: string, // "Los Pibes", "Familia García", etc.
  code: string, // "PB94-K7M2" - unique invite code
  emoji: string, // "🏆" - optional group emoji/icon

  // Owner
  createdBy: string, // userId
  createdByName: string,

  // Members
  members: [
    {
      userId: string,
      displayName: string,
      photoURL: string,
      joinedAt: Timestamp,
      role: 'admin' | 'member' // admin is creator
    }
  ],
  memberCount: number, // for easy queries

  // Stats (aggregated from members)
  stats: {
    totalStickers: number, // 960 * memberCount
    totalOwned: number,
    totalNeeded: number,
    averageCompletion: number
  },

  // Settings
  settings: {
    allowInvites: boolean, // can members invite others?
    maxMembers: number, // default 20
    isActive: boolean
  },

  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### Collection: `users` (update)
Add group reference:
```javascript
{
  uid: string,
  displayName: string,
  email: string,
  photoURL: string,

  // Group membership
  groupId: string (nullable), // ID of their current group
  groupCode: string (nullable), // Code of their current group
  groupName: string (nullable), // Name for quick display

  stats: { ... },
  createdAt: Timestamp,
  lastActive: Timestamp
}
```

### 2. Group Code Generation

**Requirements**:
- 8 characters: `XXXX-XXXX`
- URL-safe characters: A-Z, 0-9 (excluding ambiguous: 0,O,I,1)
- Must be unique across all groups

**Algorithm**:
```javascript
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // 32 chars (excludes 0,O,I,1)

function generateGroupCode() {
  let code = ''
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += '-'
    code += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return code // e.g., "PB94-K7M2"
}

async function generateUniqueGroupCode() {
  let attempts = 0
  while (attempts < 10) {
    const code = generateGroupCode()
    const existing = await getGroupByCode(code)
    if (!existing) return code
    attempts++
  }
  throw new Error('Could not generate unique code')
}
```

### 3. Screens & Components

#### GroupSetupScreen (`src/screens/GroupSetupScreen.jsx`)

**Purpose**: First-time user sees this if not in a group

**Layout**:
```
┌─────────────────────────────────────┐
│  🏆                                  │
│  CREÁ TU GRUPO                       │
│  o unite a uno existente             │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ [+] CREAR GRUPO NUEVO        │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ [🔗] UNIRME CON CÓDIGO       │   │
│  └──────────────────────────────┘   │
│                                      │
│  ¿Para qué sirve un grupo?           │
│  • Intercambiar figuritas            │
│  • Ver progreso de tus amigos        │
│  • Coordinar encuentros              │
└─────────────────────────────────────┘
```

#### CreateGroupModal (`src/components/groups/CreateGroupModal.jsx`)

**Form Fields**:
- **Nombre del grupo** (required, max 30 chars)
  - Placeholder: "Los Pibes", "Familia García"
- **Emoji** (optional, emoji picker)
  - Default: 🏆
- **Máximo de miembros** (optional, default 20)

**Actions**:
- "Crear Grupo" button
- Generates unique code
- Creates group in Firestore
- Updates user's groupId
- Shows success with code to share

#### JoinGroupModal (`src/components/groups/JoinGroupModal.jsx`)

**Form Fields**:
- **Código de invitación** (required, 8 chars with dash)
  - Format: `XXXX-XXXX`
  - Auto-format input (add dash after 4 chars)
  - Validation: must exist and have space

**Flow**:
1. User enters code
2. Click "Buscar Grupo"
3. If valid: show group preview (name, emoji, member count)
4. Confirm: "Unirme a {groupName}"
5. Add user to group.members
6. Update user's groupId

**Error States**:
- "Código inválido. Verificá que esté bien escrito."
- "Este grupo está lleno (máximo 20 miembros)."
- "Este grupo ya no está activo."

#### GroupScreen (`src/screens/GroupScreen.jsx`)

**Replaces**: The "Grupo" tab in bottom nav

**Sections**:

1. **Header**:
   - Group emoji + name
   - Group code (with copy button)
   - "Invitar Amigos" button (copies code or shares)

2. **Group Stats Card**:
   - Total members
   - Average completion: "45% completado"
   - Total stickers owned collectively
   - Progress bar

3. **Members List**:
   - Avatar, name
   - Individual stats: "234/960 (24%)"
   - Sort options:
     - By completion %
     - By name
     - By join date

4. **Actions Menu** (for admin):
   - Edit group name/emoji
   - View group settings
   - Leave group (transfers admin if needed)
   - Delete group (admin only, with confirmation)

5. **Empty State** (if no members yet):
   - "Invitá a tus amigos para empezar"
   - Show group code prominently
   - Share button

#### MemberCard (`src/components/groups/MemberCard.jsx`)

**Display**:
- Avatar (from Firebase Auth photoURL)
- Name
- Stats: "234/960 • 24%"
- Badge: "Admin" if creator
- Completion bar (small)

**Actions** (on click):
- Navigate to member's public profile
- Future: See their repeated/needed for matching

### 4. Services

#### `groupService.js` (new)

```javascript
// Create new group
export const createGroup = async (userId, userName, groupData) => {
  const code = await generateUniqueGroupCode()
  const groupDoc = {
    name: groupData.name,
    code,
    emoji: groupData.emoji || '🏆',
    createdBy: userId,
    createdByName: userName,
    members: [{
      userId,
      displayName: userName,
      photoURL: user.photoURL,
      joinedAt: Timestamp.now(),
      role: 'admin'
    }],
    memberCount: 1,
    stats: { totalStickers: 0, totalOwned: 0, totalNeeded: 0, averageCompletion: 0 },
    settings: {
      allowInvites: true,
      maxMembers: groupData.maxMembers || 20,
      isActive: true
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }

  const groupRef = await addDoc(collection(db, 'groups'), groupDoc)

  // Update user's groupId
  await updateUserGroup(userId, groupRef.id, code, groupData.name)

  return { id: groupRef.id, ...groupDoc }
}

// Get group by code
export const getGroupByCode = async (code) => {
  const groupsRef = collection(db, 'groups')
  const q = query(groupsRef, where('code', '==', code.toUpperCase()), limit(1))
  const snapshot = await getDocs(q)

  if (snapshot.empty) return null

  const doc = snapshot.docs[0]
  return { id: doc.id, ...doc.data() }
}

// Join existing group
export const joinGroup = async (userId, userName, userPhoto, code) => {
  const group = await getGroupByCode(code)

  if (!group) throw new Error('Grupo no encontrado')
  if (!group.settings.isActive) throw new Error('Este grupo ya no está activo')
  if (group.memberCount >= group.settings.maxMembers) {
    throw new Error('Este grupo está lleno')
  }

  // Check if user already in group
  if (group.members.some(m => m.userId === userId)) {
    throw new Error('Ya sos miembro de este grupo')
  }

  // Add user to group.members
  const newMember = {
    userId,
    displayName: userName,
    photoURL: userPhoto,
    joinedAt: Timestamp.now(),
    role: 'member'
  }

  await updateDoc(doc(db, 'groups', group.id), {
    members: arrayUnion(newMember),
    memberCount: increment(1),
    updatedAt: Timestamp.now()
  })

  // Update user's groupId
  await updateUserGroup(userId, group.id, group.code, group.name)

  return group
}

// Get group by ID
export const getGroup = async (groupId) => {
  const groupDoc = await getDoc(doc(db, 'groups', groupId))
  if (!groupDoc.exists()) return null
  return { id: groupDoc.id, ...groupDoc.data() }
}

// Get user's group
export const getUserGroup = async (userId) => {
  const userDoc = await getDoc(doc(db, 'users', userId))
  if (!userDoc.exists() || !userDoc.data().groupId) return null

  return getGroup(userDoc.data().groupId)
}

// Leave group
export const leaveGroup = async (userId, groupId) => {
  const group = await getGroup(groupId)

  // Remove user from members array
  const updatedMembers = group.members.filter(m => m.userId !== userId)

  // If admin leaves, transfer to oldest member
  const wasAdmin = group.members.find(m => m.userId === userId)?.role === 'admin'
  if (wasAdmin && updatedMembers.length > 0) {
    updatedMembers[0].role = 'admin'
  }

  // If last member, mark group as inactive
  if (updatedMembers.length === 0) {
    await updateDoc(doc(db, 'groups', groupId), {
      members: [],
      memberCount: 0,
      'settings.isActive': false,
      updatedAt: Timestamp.now()
    })
  } else {
    await updateDoc(doc(db, 'groups', groupId), {
      members: updatedMembers,
      memberCount: decrement(1),
      updatedAt: Timestamp.now()
    })
  }

  // Clear user's groupId
  await updateUserGroup(userId, null, null, null)
}

// Update group stats (called after member stats change)
export const updateGroupStats = async (groupId) => {
  const group = await getGroup(groupId)

  // Fetch all member stickers and calculate aggregate stats
  const memberStats = await Promise.all(
    group.members.map(async (member) => {
      const stickers = await getUserStickers(member.userId)
      return calculateStats(stickers)
    })
  )

  const stats = {
    totalStickers: 960 * group.memberCount,
    totalOwned: memberStats.reduce((sum, s) => sum + s.owned + s.repeated, 0),
    totalNeeded: memberStats.reduce((sum, s) => sum + s.needed, 0),
    averageCompletion: Math.round(
      memberStats.reduce((sum, s) => sum + s.completionPct, 0) / group.memberCount
    )
  }

  await updateDoc(doc(db, 'groups', groupId), {
    stats,
    updatedAt: Timestamp.now()
  })
}
```

#### `userService.js` (update)

```javascript
// Update user's group membership
export const updateUserGroup = async (userId, groupId, groupCode, groupName) => {
  await updateDoc(doc(db, 'users', userId), {
    groupId: groupId || null,
    groupCode: groupCode || null,
    groupName: groupName || null,
    updatedAt: Timestamp.now()
  })
}
```

### 5. User Flow

#### **First Time User** (no group):
1. User completes login
2. Check if user has groupId
3. If no group → redirect to GroupSetupScreen
4. User chooses: "Crear Grupo" or "Unirme con Código"
5. After joining/creating → redirect to HomeScreen

#### **Creating a Group**:
1. Click "Crear Grupo Nuevo"
2. CreateGroupModal opens
3. Enter name (e.g., "Los Pibes") and emoji
4. Click "Crear Grupo"
5. System generates code (e.g., "PB94-K7M2")
6. Success screen shows:
   - "¡Grupo creado!"
   - Code with copy button
   - "Compartí este código con tus amigos"
   - Share button (native share API)
7. User is now in group

#### **Joining a Group**:
1. Friend shares code: "PB94-K7M2"
2. User clicks "Unirme con Código"
3. JoinGroupModal opens
4. Enter code (auto-formats with dash)
5. Click "Buscar Grupo"
6. Preview shows: "Los Pibes 🏆 (5 miembros)"
7. Click "Unirme"
8. Success: "¡Te uniste a Los Pibes!"
9. User is now in group

#### **Viewing Group**:
1. Click "Grupo" in bottom nav
2. GroupScreen shows members and stats
3. Can view individual member progress
4. Admin can edit group settings

### 6. Navigation Changes

#### Update BottomNav
- "GRUPO" tab now goes to GroupScreen (or GroupSetupScreen if no group)
- Badge: show if there are new members (future)

#### Protected Routes
```javascript
<Route path="/grupo" element={
  <RequireGroup>
    <GroupScreen />
  </RequireGroup>
} />

// RequireGroup component redirects to GroupSetupScreen if no group
```

### 7. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Groups collection
    match /groups/{groupId} {
      // Anyone can read groups they're a member of
      allow read: if request.auth != null &&
        request.auth.uid in resource.data.members[].userId;

      // Only authenticated users can create groups
      allow create: if request.auth != null &&
        request.resource.data.createdBy == request.auth.uid;

      // Only group members can update (for admin actions)
      allow update: if request.auth != null &&
        request.auth.uid in resource.data.members[].userId;

      // Only admin can delete
      allow delete: if request.auth != null &&
        get(/databases/$(database)/documents/groups/$(groupId))
          .data.createdBy == request.auth.uid;
    }

    // Users collection (update)
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 8. UI/UX Design

**Design System** (cyberpunk theme):
- Group cards: var(--surface-2) with border
- Group code: monospace font, lime color, copy button
- Member cards: compact, with avatar and progress bar
- Admin badge: gold (var(--gold))
- Share button: primary pink gradient
- Empty states: friendly illustrations

**Copy Button**:
```javascript
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
  alert('Código copiado al portapapeles!')
}
```

**Native Share API** (for mobile):
```javascript
const shareGroupCode = async (code, groupName) => {
  if (navigator.share) {
    await navigator.share({
      title: `Unite a ${groupName}`,
      text: `¡Unite a mi grupo de Figus! Código: ${code}`,
      url: `https://figus.app/join/${code}` // future deep link
    })
  } else {
    copyToClipboard(code)
  }
}
```

### 9. Testing Scenarios

1. **Create group with User A**
   - Verify code is generated
   - User A is admin
   - User A's profile shows groupId

2. **User B joins with code**
   - Code lookup works
   - User B added to group.members
   - Group memberCount increments

3. **View group from both users**
   - Both see each other in members list
   - Stats are calculated correctly

4. **Admin leaves group**
   - Admin role transfers to User B
   - User A's groupId cleared

5. **Edge cases**:
   - Invalid code shows error
   - Full group (20 members) rejects new joins
   - User can't join same group twice

## Acceptance Criteria

- [ ] Users collection updated with groupId fields
- [ ] Groups collection created in Firestore
- [ ] Group code generation works and is unique
- [ ] CreateGroupModal creates groups correctly
- [ ] JoinGroupModal validates codes and adds members
- [ ] GroupSetupScreen shown for users without group
- [ ] GroupScreen displays members and stats
- [ ] Copy and share functionality works
- [ ] Admin can edit group settings
- [ ] Users can leave group
- [ ] Group stats update when member stats change
- [ ] Security rules enforce group privacy
- [ ] Mobile-responsive design
- [ ] Empty states for all scenarios

## Future Enhancements (Phase 8+)

- [ ] Multiple groups per user
- [ ] Group chat/messages
- [ ] Group achievements ("50% completado colectivamente!")
- [ ] Group leaderboard
- [ ] Remove members (admin only)
- [ ] Group profile pictures
- [ ] Deep links for instant join: `figus://join/PB94-K7M2`

## Dependencies

- Existing: userService.js
- Existing: stickerService.js and calculateStats()
- New: groupService.js
- React Router for navigation
- Clipboard API for copy functionality
- Navigator.share API for mobile sharing

## Estimated Time Breakdown

1. Update Firestore schema and security rules: 0.5 hour
2. Implement groupService.js: 1.5 hours
3. Create GroupSetupScreen: 0.5 hour
4. Create CreateGroupModal: 1 hour
5. Create JoinGroupModal: 1 hour
6. Create GroupScreen with members list: 1.5 hours
7. Update BottomNav and routing: 0.5 hour
8. Testing with multiple users: 1 hour

**Total**: ~7.5 hours

## Implementation Priority

This is now a **prerequisite for Phase 7 (Trades)**. Complete Phase 6 before implementing any trade functionality.
