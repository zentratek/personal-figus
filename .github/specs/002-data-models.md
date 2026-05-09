# 002 - Data Models

---
**Title:** Figus - Firestore Data Models & Schema
**Status:** 🟢 Approved
**Created:** 2026-05-08
**Updated:** 2026-05-08
**Authors:** Juan
**Reviewers:** Juan, hijo

---

## Summary

Diseño completo de las 5 colecciones Firestore: `users`, `stickers`, `groups`, `trades`, y `albums`. Incluye schema, índices, security rules, y estrategias de denormalización.

## Firestore Collections Overview

```
Firestore DB
├── users/{userId}                    # User profiles
├── stickers/{userId_stickerId}       # User's sticker collection
├── groups/{groupId}                  # Friend groups
├── trades/{tradeId}                  # Trade proposals
└── albums/{albumId}                  # Album metadata (read-only)
```

## Collection: `users`

**Purpose:** User profiles con stats denormalizadas para performance.

### Schema

```typescript
users/{userId}  // userId = Firebase Auth UID
{
  // Identity (from Google OAuth)
  uid: string,
  email: string,
  displayName: string,
  photoURL: string | null,

  // Customization
  avatarLetter: string,              // "M" (primera letra del nombre)
  avatarColor: string,               // "#00F0FF" (cyan, gold, lime, etc.)

  // Current state
  currentGroupId: string | null,     // Grupo activo (solo 1 a la vez)
  albumId: string,                   // "copa-2026"

  // Denormalized stats (para evitar queries pesadas)
  stats: {
    totalOwned: number,              // Figuritas que tiene
    totalRepeated: number,           // Cantidad de repetidas
    totalNeeded: number,             // Figuritas que le faltan
    completionPct: number,           // % completado (0-100)
    streakDays: number,              // Días consecutivos agregando
    lastAddedAt: Timestamp | null    // Última vez que agregó una
  },

  // Denormalized for matchmaking (optimization)
  denormalized: {
    repeatedIds: string[],           // Max 100 (suficiente para UI)
    neededIds: string[],             // Max 980 (todas las del álbum Copa 2026)
    lastSyncAt: Timestamp
  },

  // Timestamps
  createdAt: Timestamp,
  lastLogin: Timestamp
}
```

### Indices

```javascript
// Automáticos
- uid (primary key)
- email (Firebase Auth)

// Compuestos necesarios
- currentGroupId + lastLogin (query: miembros activos del grupo)
```

### Example Document

```json
{
  "uid": "xYz789AbC",
  "email": "martin@gmail.com",
  "displayName": "Martín López",
  "photoURL": "https://lh3.googleusercontent.com/...",
  "avatarLetter": "M",
  "avatarColor": "#00F0FF",
  "currentGroupId": "grp_abc123",
  "albumId": "copa-2026",
  "stats": {
    "totalOwned": 180,
    "totalRepeated": 45,
    "totalNeeded": 458,
    "completionPct": 28,
    "streakDays": 12,
    "lastAddedAt": "2026-05-08T10:30:00Z"
  },
  "denormalized": {
    "repeatedIds": ["ARG-045", "BRA-067", "URU-012", ...],
    "neededIds": ["MEX-089", "CHI-034", ...],
    "lastSyncAt": "2026-05-08T10:30:00Z"
  },
  "createdAt": "2026-05-01T08:00:00Z",
  "lastLogin": "2026-05-08T09:15:00Z"
}
```

---

## Collection: `stickers`

**Purpose:** Cada doc = 1 figurita de 1 usuario. Total: 980 docs por usuario (48 equipos × 20 + 20 extras × 4 variantes).

### Schema

```typescript
stickers/{compositeKey}  // compositeKey = "{userId}_{albumId}_{stickerId}"
{
  // Ownership
  userId: string,                    // Owner de esta figurita
  stickerId: string,                 // "ARG-045"
  albumId: string,                   // "copa-2026"

  // Estado actual
  status: "needed" | "owned" | "repeated",
  count: number,                     // 0 para needed/owned, 2+ para repeated

  // Metadata (denormalizada del álbum)
  number: number,                    // 45
  team: string,                      // "ARG"
  playerName: string,                // "Lionel Messi"
  position: string,                  // "DEL", "MED", "DEF", "POR", "ESCUDO"
  isSpecial: boolean,                // true si es holográfica/dorada

  // Timestamps
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Composite Key Strategy

```javascript
// Formato: {userId}_{albumId}_{stickerId}
// Ejemplo:
"xYz789AbC_copa-2026_ARG-045"

// Ventajas:
// - Garantiza unicidad (1 usuario no puede tener duplicados)
// - Query eficiente por userId
// - Fácil de parsear
```

### Indices

```javascript
// Necesarios para queries
- userId + albumId + status
- userId + albumId + isSpecial
- userId + albumId + team
```

### Why Denormalize playerName, team, etc.?

**Alternativa: Join con `albums`**
```javascript
// ❌ Opción 1: Sin denormalizar
const stickers = await getStickers(userId);  // 638 reads
for (const s of stickers) {
  const album = await getAlbum(s.albumId);   // +638 reads
  s.playerName = album.stickers[s.number].name;
}
// Total: 1276 reads 😱
```

**Con denormalización:**
```javascript
// ✅ Opción 2: Denormalizar
const stickers = await getStickers(userId);  // 638 reads
// playerName ya está en cada doc
// Total: 638 reads ✅
```

**Trade-off:**
- ⚠️ Más espacio (pero irrelevante: 200 bytes × 638 = 127 KB)
- ✅ 50% menos reads (más barato, más rápido)

**Decision:** Denormalizar es correcto para este caso.

### Example Document

```json
{
  "userId": "xYz789AbC",
  "stickerId": "ARG-045",
  "albumId": "copa-2026",
  "status": "repeated",
  "count": 3,
  "number": 45,
  "team": "ARG",
  "playerName": "Lionel Messi",
  "position": "DEL",
  "isSpecial": false,
  "createdAt": "2026-05-01T08:00:00Z",
  "updatedAt": "2026-05-08T10:30:00Z"
}
```

---

## Collection: `groups`

**Purpose:** Grupos cerrados de amigos (max 10 miembros).

### Schema

```typescript
groups/{groupId}
{
  id: string,                        // Auto-generado por Firestore
  name: string,                      // "LOS PIBES"
  code: string,                      // "PB-9X4Q" (único, 7 chars)
  albumId: string,                   // "copa-2026"

  // Ownership
  createdBy: string,                 // userId del creador
  createdAt: Timestamp,

  // Members
  members: string[],                 // Array de userIds (max 10)
  memberCount: number,               // Denormalizado (evita .length)

  // Settings
  maxMembers: number,                // Default: 10
  isOpen: boolean,                   // false en MVP (grupos cerrados)

  // Activity
  lastActivityAt: Timestamp
}
```

### Indices

```javascript
- code (unique) // Para joinGroup(code)
- members array-contains // Para "mis grupos"
- createdBy
```

### Code Format: `XX-YYYY`

```javascript
// Generación
name = "LOS PIBES"
initials = "PB"  // Primeras 2 letras
random = "9X4Q"  // 4 chars alfanuméricos (sin 0/O, 1/I)
code = "PB-9X4Q"

// Validación
/^[A-Z0-9]{2}-[A-Z0-9]{4}$/
```

### Example Document

```json
{
  "id": "grp_abc123",
  "name": "LOS PIBES",
  "code": "PB-9X4Q",
  "albumId": "copa-2026",
  "createdBy": "xYz789AbC",
  "members": ["xYz789AbC", "user2", "user3", "user4", "user5"],
  "memberCount": 5,
  "maxMembers": 10,
  "isOpen": false,
  "createdAt": "2026-05-01T08:00:00Z",
  "lastActivityAt": "2026-05-08T10:30:00Z"
}
```

---

## Collection: `trades`

**Purpose:** Propuestas de intercambio entre miembros de un grupo.

### Schema

```typescript
trades/{tradeId}
{
  id: string,                        // Auto-generado
  groupId: string,                   // Grupo donde ocurre el trade
  albumId: string,                   // "copa-2026"

  // Parties
  proposerId: string,                // Quien propone
  receiverId: string,                // Quien recibe la propuesta

  // Items being traded
  proposerGives: string[],           // ["ARG-045", "BRA-067"]
  proposerReceives: string[],        // ["MEX-012", "CHI-089"]

  // Status
  status: "pending" | "accepted" | "rejected" | "cancelled" | "completed",

  // Optional message
  message: string | null,            // "Hola! Me re sirven 👌"

  // Timestamps
  proposedAt: Timestamp,
  respondedAt: Timestamp | null,     // Cuando acepta/rechaza
  completedAt: Timestamp | null,     // Cuando marcan como completado

  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Status Flow

```
pending → accepted → completed
        ↘ rejected
        ↘ cancelled (por proposer)
```

### Indices

```javascript
- groupId + status
- proposerId + status // "Mis propuestas enviadas"
- receiverId + status // "Propuestas recibidas"
```

### Example Document

```json
{
  "id": "trade_xyz",
  "groupId": "grp_abc123",
  "albumId": "copa-2026",
  "proposerId": "xYz789AbC",
  "receiverId": "user2",
  "proposerGives": ["ARG-045", "BRA-067"],
  "proposerReceives": ["MEX-012", "CHI-089"],
  "status": "pending",
  "message": "Hola! Me re sirven 👌",
  "proposedAt": "2026-05-08T10:30:00Z",
  "respondedAt": null,
  "completedAt": null,
  "createdAt": "2026-05-08T10:30:00Z",
  "updatedAt": "2026-05-08T10:30:00Z"
}
```

---

## Collection: `albums` (Read-Only Metadata)

**Purpose:** Metadata de álbumes Panini disponibles. Seed data precargada.

### Copa Mundial de la FIFA 2026™ - Official Specs

**Información oficial del álbum Panini:**
- **112 páginas**
- **980 stickers totales**
- **7 stickers por sobre**
- **1 sticker extra insertado aleatoriamente**
- **Display Box: 104 sobres**
- **48 selecciones** (más selecciones que nunca)

**Estructura por selección:**
- **2 páginas por equipo**
- **20 stickers por selección:**
  - 18 stickers de retratos de jugadores
  - 1 sticker grupal del equipo
  - 1 escudo oficial en material especial

**Páginas especiales adicionales:**
- Estadios
- Calendario de partidos
- Historia de la Copa Mundial de la FIFA™
- Camino a la Copa Mundial de la FIFA™
- Récords

**Stickers extra:**
- **20 stickers extra únicos** de jugadores en acción
- **4 variantes de color** por sticker
- **Inserción aleatoria:** 1 cada 100 sobres en promedio
- Mismo formato que la colección 2022

### Schema

```typescript
albums/{albumId}
{
  id: string,                        // "copa-mundial-fifa-2026"
  name: string,                      // "Copa Mundial de la FIFA 2026™"
  year: number,                      // 2026
  publisher: string,                 // "Panini"

  // Configuration (Official)
  totalStickers: number,             // 980
  totalPages: number,                // 112
  stickersPerPack: number,           // 7
  packsPerBox: number,               // 104
  totalTeams: number,                // 48

  // Team configuration
  teams: Team[],                     // Array de 48 equipos
  stickersPerTeam: number,           // 20

  // Special stickers
  specialStickers: SpecialSticker[], // 20 stickers extra en acción
  specialStickerVariants: number,    // 4 (colores)
  specialStickerFrequency: number,   // 100 (1 cada 100 sobres)

  // Metadata
  coverImage: string | null,         // URL (opcional)
  releaseDate: string,               // TBD

  isActive: boolean,                 // true si se puede usar
  createdAt: Timestamp
}

type Team = {
  code: string,                      // "ARG"
  name: string,                      // "Argentina"
  color1: string,                    // "#6CB7FF"
  color2: string,                    // "#FFFFFF"
  stickerRange: [number, number],    // [1, 20]
  stickers: {
    portraits: number,               // 18 (retratos)
    groupPhoto: number,              // 1 (foto grupal)
    badge: number                    // 1 (escudo especial)
  }
}

type SpecialSticker = {
  id: string,                        // "ACTION-001"
  playerName: string,                // "Lionel Messi"
  team: string,                      // "ARG"
  variants: string[]                 // ["red", "blue", "green", "gold"]
}
```

### Example Document

```json
{
  "id": "copa-mundial-fifa-2026",
  "name": "Copa Mundial de la FIFA 2026™",
  "year": 2026,
  "publisher": "Panini",
  "totalStickers": 980,
  "totalPages": 112,
  "stickersPerPack": 7,
  "packsPerBox": 104,
  "totalTeams": 48,
  "teams": [
    {
      "code": "ARG",
      "name": "Argentina",
      "color1": "#6CB7FF",
      "color2": "#FFFFFF",
      "stickerRange": [1, 20],
      "stickers": {
        "portraits": 18,
        "groupPhoto": 1,
        "badge": 1
      }
    },
    {
      "code": "BRA",
      "name": "Brasil",
      "color1": "#FFE34D",
      "color2": "#1F8A4D",
      "stickerRange": [21, 40],
      "stickers": {
        "portraits": 18,
        "groupPhoto": 1,
        "badge": 1
      }
    }
    // ... 46 equipos más (48 total)
  ],
  "stickersPerTeam": 20,
  "specialStickers": [
    {
      "id": "ACTION-001",
      "playerName": "Lionel Messi",
      "team": "ARG",
      "variants": ["red", "blue", "green", "gold"]
    }
    // ... 19 stickers extra más (20 total)
  ],
  "specialStickerVariants": 4,
  "specialStickerFrequency": 100,
  "coverImage": null,
  "releaseDate": "TBD",
  "isActive": true,
  "createdAt": "2026-01-01T00:00:00Z"
}
```

---

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    function isMemberOfGroup(groupId) {
      return isSignedIn() &&
             request.auth.uid in get(/databases/$(database)/documents/groups/$(groupId)).data.members;
    }

    // Users
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId);
      allow delete: if false;  // No se pueden eliminar
    }

    // Stickers
    match /stickers/{stickerId} {
      allow read: if isSignedIn();  // Todos ven (para matchmaking)
      allow create: if isSignedIn() && stickerId.matches(request.auth.uid + '_.*');
      allow update: if isOwner(resource.data.userId);
      allow delete: if isOwner(resource.data.userId);
    }

    // Groups
    match /groups/{groupId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isMemberOfGroup(groupId);
      allow delete: if resource.data.createdBy == request.auth.uid;
    }

    // Trades
    match /trades/{tradeId} {
      allow read: if isSignedIn() &&
                     (request.auth.uid == resource.data.proposerId ||
                      request.auth.uid == resource.data.receiverId ||
                      isMemberOfGroup(resource.data.groupId));
      allow create: if isSignedIn() &&
                       request.resource.data.proposerId == request.auth.uid;
      allow update: if isSignedIn() &&
                       (request.auth.uid == resource.data.proposerId ||
                        request.auth.uid == resource.data.receiverId);
      allow delete: if request.auth.uid == resource.data.proposerId;
    }

    // Albums (read-only)
    match /albums/{albumId} {
      allow read: if true;  // Público
      allow write: if false;  // Solo admins via console
    }
  }
}
```

## Data Initialization

### New User Flow

```javascript
// 1. User signs in with Google
// 2. Create user profile
await setDoc(doc(db, 'users', user.uid), {
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  albumId: 'copa-mundial-fifa-2026',
  stats: {
    totalOwned: 0,
    totalRepeated: 0,
    totalNeeded: 980,  // Total oficial del álbum 2026
    completionPct: 0,
    streakDays: 0,
    lastAddedAt: null
  },
  // ... (ver schema completo arriba)
});

// 3. Generate initial album (980 stickers in "needed" status)
// NOTA: Por performance, esto se hace en Cloud Functions, no en el cliente
// Se ejecuta automáticamente cuando se crea el usuario en Firestore

// Cloud Function: onUserCreate
const album = await getDoc(doc(db, 'albums', 'copa-mundial-fifa-2026'));
const albumData = album.data();

// 980 stickers = 48 equipos × 20 stickers + 20 stickers extra × 4 variantes
// Para batch writes, Firestore tiene límite de 500 operaciones
// Usamos múltiples batches

const batches = [];
let currentBatch = writeBatch(db);
let operationCount = 0;

// Generar stickers de equipos (48 × 20 = 960)
albumData.teams.forEach(team => {
  for (let i = 0; i < 20; i++) {
    const number = team.stickerRange[0] + i;
    const stickerId = `${team.code}-${String(number).padStart(3, '0')}`;
    const docId = `${user.uid}_copa-mundial-fifa-2026_${stickerId}`;

    currentBatch.set(doc(db, 'stickers', docId), {
      userId: user.uid,
      stickerId,
      albumId: 'copa-mundial-fifa-2026',
      status: 'needed',
      count: 0,
      number,
      team: team.code,
      playerName: generatePlayerName(),  // Mock or from seed data
      position: i === 0 ? 'BADGE' : i === 1 ? 'GROUP' : randomPosition(),
      isSpecial: i === 0,  // Badge es especial
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    operationCount++;

    // Si llegamos a 500, crear nuevo batch
    if (operationCount === 500) {
      batches.push(currentBatch);
      currentBatch = writeBatch(db);
      operationCount = 0;
    }
  }
});

// Generar stickers extra (20 × 4 variantes = 80)
albumData.specialStickers.forEach(special => {
  special.variants.forEach(variant => {
    const stickerId = `${special.id}-${variant}`;
    const docId = `${user.uid}_copa-mundial-fifa-2026_${stickerId}`;

    currentBatch.set(doc(db, 'stickers', docId), {
      userId: user.uid,
      stickerId,
      albumId: 'copa-mundial-fifa-2026',
      status: 'needed',
      count: 0,
      number: 0,  // No tiene número de página
      team: special.team,
      playerName: special.playerName,
      position: 'ACTION',
      isSpecial: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    operationCount++;
  });
});

// Agregar el último batch si tiene operaciones
if (operationCount > 0) {
  batches.push(currentBatch);
}

// Ejecutar todos los batches en paralelo
await Promise.all(batches.map(batch => batch.commit()));

// Total: 980 stickers creados (960 equipos + 20 extras con 4 variantes)
```

## Open Questions

- ✅ ¿Denormalizar o no playerName?
  - **Decision:** Sí, mejora performance 50%

- ⚠️ ¿Agregar campo `version` para schema migrations?
  - **Status:** No necesario en MVP, evaluar en v2.0

- ❓ ¿Permitir backup/export de colección?
  - **Status:** Pendiente, evaluar en v2.0

## References

- [Architecture](./001-architecture.md)
- [Authentication](./003-authentication.md)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)

---

**Next:** [003-authentication.md](./003-authentication.md)
