# Figus - Master Plan de Implementación

**Proyecto:** figus.digital
**Versión:** 1.0.0 MVP
**Fecha:** 2026-05-08
**Autores:** Juan + hijo (14 años)

---

## 📋 Índice

1. [Overview del Proyecto](#overview-del-proyecto)
2. [Arquitectura Técnica](#arquitectura-técnica)
3. [Modelos de Datos](#modelos-de-datos)
4. [Autenticación y Seguridad](#autenticación-y-seguridad)
5. [Sistema de Invitaciones](#sistema-de-invitaciones)
6. [Lógica de Matchmaking](#lógica-de-matchmaking)
7. [Plan de Implementación por Fases](#plan-de-implementación-por-fases)
8. [Decisiones de Diseño Técnico](#decisiones-de-diseño-técnico)

---

## Overview del Proyecto

### 🎯 Visión

**Figus** es una aplicación web colaborativa que permite a grupos de amigos adolescentes gestionar sus colecciones de figuritas Panini e intercambiarlas entre sí de manera eficiente y social.

**Propuesta de Valor:**
- 📊 **Gestión digital** del álbum físico (evita llevar el álbum al colegio)
- 🎯 **Matchmaker automático** que encuentra intercambios ganar-ganar
- 👥 **Social por diseño** - grupos cerrados de amigos
- 📱 **Mobile-first** - diseñado para usar mientras abren sobres

### 🎨 Estética Visual

**Dark Mode Cyberpunk / Gaming Brutalism**
- Inspiración: Trading card games digitales, coleccionismo moderno
- Colores neón sobre fondo oscuro
- Sombras duras (hard shadows), no difusas
- Tipografías monospace para datos técnicos
- Energético, juvenil, tech-forward

### 👥 Usuario Objetivo

- **Edad:** 12-16 años
- **Contexto:** Colegio, casa, mientras abren sobres con amigos
- **Dispositivo:** Smartphone (iOS/Android)
- **Experiencia técnica:** Usuario casual de apps móviles
- **Pain points:**
  - No saber quién tiene las figuritas que necesitan
  - Llevar el álbum físico a todos lados
  - Registrar repetidas manualmente en papel

### 🎯 Funcionalidades Core (MVP)

1. **Autenticación con Google** - Registro/login simple
2. **Mi Álbum Digital** - Grid interactivo con estados (tengo/falta/repetidas)
3. **Grupos** - Crear/unirse con código de invitación
4. **Matchmaker** - Algoritmo que encuentra intercambios posibles
5. **Propuestas de Intercambio** - Enviar propuestas a amigos del grupo

**Fuera del MVP v1.0:**
- ❌ Marketplace/venta (requiere manejo de dinero y legalidad de menores)
- ❌ Chat en tiempo real (usar WhatsApp/Discord para coordinar)
- ❌ Gamificación avanzada (logros, rankings, etc.)
- ❌ Múltiples álbumes simultáneos
- ❌ Notificaciones push (inicialmente solo in-app)

---

## Arquitectura Técnica

### Stack Tecnológico

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                      │
│  React 18 + Vite + Tailwind CSS + React Router │
│              PWA (Workbox)                      │
└──────────────────┬──────────────────────────────┘
                   │
                   │ HTTPS
                   │
┌──────────────────▼──────────────────────────────┐
│                  FIREBASE                       │
│  ┌─────────────┬──────────────┬─────────────┐  │
│  │    Auth     │  Firestore   │   Hosting   │  │
│  │  (Google)   │   (NoSQL)    │   (CDN)     │  │
│  └─────────────┴──────────────┴─────────────┘  │
└─────────────────────────────────────────────────┘
```

### Por qué Firebase?

**Ventajas para este proyecto:**
- ✅ Autenticación Google OAuth integrada (1 click)
- ✅ Firestore = NoSQL flexible (ideal para colecciones dinámicas)
- ✅ Plan gratuito generoso (hasta 50K lecturas/día)
- ✅ Hosting + CDN global incluido
- ✅ Sincronización en tiempo real out-of-the-box
- ✅ Cero configuración de servidor (padre e hijo no son DevOps)
- ✅ Escalable si el proyecto crece

**Trade-offs:**
- ⚠️ Vendor lock-in con Google
- ⚠️ Costos pueden crecer con uso masivo
- ⚠️ Queries complejas requieren índices manuales

**Decisión:** Los beneficios superan los trade-offs para un MVP educativo.

### Estructura de Directorios

```
figus/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── icons/                 # App icons 192x192, 512x512
│   └── sw.js                  # Service Worker
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── BottomNav.jsx
│   │   │   ├── TopBar.jsx
│   │   │   └── StickerModal.jsx
│   │   ├── common/
│   │   │   ├── StickerCell.jsx    # Componente hero
│   │   │   ├── Card.jsx
│   │   │   ├── CTA.jsx
│   │   │   ├── Pill.jsx
│   │   │   └── MiniSticker.jsx
│   │   ├── player/
│   │   │   └── PlayerFace.jsx
│   │   └── icons/
│   │       └── Icon.jsx
│   ├── screens/
│   │   ├── HomeScreen.jsx
│   │   ├── AlbumScreen.jsx
│   │   ├── MatchesScreen.jsx
│   │   └── MatchDetailScreen.jsx
│   ├── services/
│   │   ├── firebase.js          # Config
│   │   ├── authService.js       # Auth logic
│   │   ├── stickerService.js    # CRUD figuritas
│   │   ├── matchService.js      # Matchmaking
│   │   └── groupService.js      # Gestión grupos
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useStickers.js
│   │   ├── useMatches.js
│   │   └── useGroup.js
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── constants/
│   │   ├── colors.js
│   │   ├── stickerStates.js
│   │   └── albums.js            # Metadata de álbumes Panini
│   ├── utils/
│   │   ├── matchmaker.js        # Algoritmo de matching
│   │   └── groupCode.js         # Generador de códigos
│   ├── App.jsx
│   ├── index.css                # Tailwind + custom properties
│   └── main.jsx
├── .env.example                 # Variables de entorno
├── .gitignore
├── package.json
├── tailwind.config.js
├── vite.config.js
├── firebase.json                # Firebase Hosting config
└── firestore.rules              # Security rules
```

### Configuración de Entorno

```bash
# .env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=figus-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=figus-app
VITE_FIREBASE_STORAGE_BUCKET=figus-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## Modelos de Datos

### Firestore Collections

#### 👤 `users`

```typescript
users/{userId}
{
  uid: string,                    // Firebase Auth UID
  email: string,                  // Email de Google
  displayName: string,            // Nombre completo
  photoURL: string | null,        // Avatar de Google
  createdAt: Timestamp,
  lastLogin: Timestamp,

  // Profile customization
  avatarLetter: string,           // "M" para Martín
  avatarColor: string,            // "#00F0FF" (cyan, gold, lime, etc.)

  // Current state
  currentGroupId: string | null,  // Grupo activo
  albumId: string,                // Referencia al álbum ("copa-2026")

  // Stats (denormalizadas para performance)
  stats: {
    totalOwned: number,
    totalRepeated: number,
    totalNeeded: number,
    completionPct: number,
    streakDays: number,
    lastAddedAt: Timestamp
  }
}
```

**Indices necesarios:**
- `email` (automático por Auth)
- `currentGroupId` (para queries de grupo)

---

#### 🎴 `stickers`

```typescript
stickers/{userId_stickerId}           // Composite key
{
  userId: string,                     // Owner
  stickerId: string,                  // "ARG-001", "BRA-045", etc.
  albumId: string,                    // "copa-2026"

  // Estado actual
  status: "needed" | "owned" | "repeated",
  count: number,                      // 0 para needed/owned, 2+ para repeated

  // Metadata de la figurita (denormalizada del álbum)
  number: number,                     // 1-638
  team: string,                       // "ARG", "BRA", etc.
  playerName: string,                 // "Lionel Messi"
  position: string,                   // "DEL", "MED", "DEF", "POR", "ESCUDO"
  isSpecial: boolean,                 // Holográfica/dorada

  updatedAt: Timestamp,
  createdAt: Timestamp
}
```

**Indices necesarios:**
- `userId` + `albumId` (query principal)
- `userId` + `status` (filtrar por estado)
- `userId` + `isSpecial` (filtro de especiales)

**Estructura de Composite Key:**
```javascript
// Ejemplo: ARG-001 para Martín (uid: xYz789)
stickerId = "xYz789_copa-2026_ARG-001"
```

**¿Por qué denormalizar playerName, team, etc.?**
- ✅ Queries más rápidas (no joins)
- ✅ Menos lecturas de Firestore (más barato)
- ⚠️ Más espacio (pero irrelevante con 200-600 docs por usuario)

---

#### 👥 `groups`

```typescript
groups/{groupId}
{
  id: string,                         // Auto-generado
  name: string,                       // "LOS PIBES"
  code: string,                       // "PB-9X4Q" (único, 7 chars)
  albumId: string,                    // "copa-2026"

  // Ownership
  createdBy: string,                  // userId del creador
  createdAt: Timestamp,

  // Members
  members: string[],                  // Array de userIds
  memberCount: number,                // Denormalizado (max 10)

  // Settings
  maxMembers: number,                 // Default: 10
  isOpen: boolean,                    // false = cerrado, true = público

  // Activity
  lastActivityAt: Timestamp
}
```

**Indices necesarios:**
- `code` (unique, para join por código)
- `members` array-contains (para queries "mis grupos")

**Límites:**
- Máximo 10 miembros por grupo (MVP)
- Un usuario puede estar en múltiples grupos (pero solo 1 activo a la vez)

---

#### 🔄 `trades`

```typescript
trades/{tradeId}
{
  id: string,                         // Auto-generado
  groupId: string,                    // Grupo donde ocurre el trade
  albumId: string,                    // "copa-2026"

  // Parties
  proposerId: string,                 // Quien propone
  receiverId: string,                 // Quien recibe la propuesta

  // Items being traded
  proposerGives: string[],            // ["ARG-045", "BRA-067"]
  proposerReceives: string[],         // ["MEX-012", "CHI-089"]

  // Status
  status: "pending" | "accepted" | "rejected" | "cancelled" | "completed",

  // Optional message
  message: string | null,             // "Hola! Me re sirven 👌"

  // Timestamps
  proposedAt: Timestamp,
  respondedAt: Timestamp | null,
  completedAt: Timestamp | null,

  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Indices necesarios:**
- `groupId` + `status` (listar trades activos del grupo)
- `proposerId` + `status` (mis propuestas enviadas)
- `receiverId` + `status` (propuestas recibidas)

**Estados del flujo:**
```
pending → accepted → completed
        ↘ rejected
        ↘ cancelled (por proposer)
```

**Nota importante:**
El MVP NO ejecuta el intercambio automáticamente. Solo registra el acuerdo. Los usuarios deben marcar las figuritas manualmente después del intercambio físico.

---

#### 📚 `albums` (Metadata - Read-only)

```typescript
albums/{albumId}
{
  id: string,                         // "copa-2026"
  name: string,                       // "COPA CONTINENTAL"
  year: number,                       // 2026
  publisher: string,                  // "Panini"

  // Configuration
  totalStickers: number,              // 638 (ejemplo)
  teams: Team[],                      // Array de equipos
  specialNumbers: number[],           // [7, 33, 45, 78, 91, ...]

  // Metadata
  coverImage: string | null,          // URL
  releaseDate: string,                // "2026-03-15"

  isActive: boolean,                  // true si se puede usar
  createdAt: Timestamp
}

type Team = {
  code: string,                       // "ARG"
  name: string,                       // "Argentina"
  color1: string,                     // "#6CB7FF" (celeste)
  color2: string,                     // "#FFFFFF" (blanco)
  stickerRange: [number, number]      // [1, 10]
}
```

**Uso:**
- Esta colección es **seed data** (precargada)
- Los usuarios NO la modifican
- Útil para generar el álbum inicial de un usuario
- Útil para validar que un `stickerId` existe

**Ejemplo completo:**
```javascript
{
  id: "copa-2026",
  name: "COPA CONTINENTAL",
  year: 2026,
  publisher: "Panini",
  totalStickers: 200,  // 20 equipos × 10 figuritas
  teams: [
    { code: "ARG", name: "Argentina", color1: "#6CB7FF", color2: "#FFFFFF", stickerRange: [1, 10] },
    { code: "BRA", name: "Brasil", color1: "#FFE34D", color2: "#1F8A4D", stickerRange: [11, 20] },
    // ... 18 equipos más
  ],
  specialNumbers: [7, 17, 27, 37, 47, 57, 67, 77, 87, 97],  // Cada equipo tiene 1 especial
  isActive: true,
  createdAt: Timestamp.now()
}
```

---

### Reglas de Seguridad (Firestore Rules)

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
      allow delete: if false;  // No se pueden eliminar cuentas (MVP)
    }

    // Stickers
    match /stickers/{stickerId} {
      allow read: if isSignedIn();  // Todos pueden ver (para matchmaking)
      allow create: if isSignedIn() &&
                       stickerId.matches(request.auth.uid + '_.*');  // Solo crear propias
      allow update: if isOwner(resource.data.userId);
      allow delete: if isOwner(resource.data.userId);
    }

    // Groups
    match /groups/{groupId} {
      allow read: if isSignedIn();  // Todos pueden ver grupos (para join)
      allow create: if isSignedIn();
      allow update: if isMemberOfGroup(groupId);  // Solo miembros pueden editar
      allow delete: if resource.data.createdBy == request.auth.uid;  // Solo owner puede eliminar
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

---

## Autenticación y Seguridad

### Flujo de Autenticación con Google OAuth

```
┌─────────────────────────────────────────────────┐
│  1. Usuario toca "Continuar con Google"        │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  2. Firebase abre popup/redirect OAuth Google   │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  3. Usuario elige cuenta Google                 │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  4. Firebase devuelve credential + ID token     │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  5. App verifica si user existe en /users/{uid} │
└──────────────────┬──────────────────────────────┘
                   │
         ┌─────────┴──────────┐
         ▼                    ▼
    [Existe]            [No existe]
         │                    │
         │                    ▼
         │          ┌──────────────────────┐
         │          │  6. Crear doc        │
         │          │     en /users/       │
         │          │  7. Generar álbum    │
         │          │     inicial (638     │
         │          │     figuritas en     │
         │          │     estado "needed") │
         │          └──────────┬───────────┘
         │                     │
         └─────────┬───────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  8. Redirect a Home Screen                      │
└─────────────────────────────────────────────────┘
```

### Implementación en `authService.js`

```javascript
// src/services/authService.js
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firestore';
import { auth, db } from './firebase';
import { generateInitialAlbum } from '../utils/albumGenerator';

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Verificar si ya existe el usuario
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      // Usuario nuevo - crear perfil
      await createUserProfile(user);
      await generateInitialAlbum(user.uid, 'copa-2026');
    } else {
      // Usuario existente - actualizar lastLogin
      await setDoc(doc(db, 'users', user.uid), {
        lastLogin: Timestamp.now()
      }, { merge: true });
    }

    return user;
  } catch (error) {
    console.error('Error en sign in:', error);
    throw error;
  }
};

async function createUserProfile(user) {
  const userProfile = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || 'Usuario',
    photoURL: user.photoURL,
    createdAt: Timestamp.now(),
    lastLogin: Timestamp.now(),

    // Customization
    avatarLetter: (user.displayName || 'U').charAt(0).toUpperCase(),
    avatarColor: getRandomColor(),

    // Initial state
    currentGroupId: null,
    albumId: 'copa-2026',

    // Stats
    stats: {
      totalOwned: 0,
      totalRepeated: 0,
      totalNeeded: 638,  // Total del álbum
      completionPct: 0,
      streakDays: 0,
      lastAddedAt: null
    }
  };

  await setDoc(doc(db, 'users', user.uid), userProfile);
}

function getRandomColor() {
  const colors = ['#FFC700', '#00F0FF', '#C6FF3E', '#FF2D8E', '#9B5BFF'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export const signOut = async () => {
  await firebaseSignOut(auth);
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
```

### Seguridad y Consideraciones

**Datos sensibles:**
- ❌ NO almacenar tokens de autenticación en localStorage
- ✅ Firebase SDK maneja tokens automáticamente
- ✅ Tokens expiran y se refrescan automáticamente

**Privacidad:**
- Los emails son visibles solo para el usuario mismo
- Los displayName son públicos dentro del grupo
- No hay perfil público fuera del grupo

**Protección contra abuso:**
```javascript
// Firestore Rules - Rate limiting básico
match /stickers/{stickerId} {
  allow create: if isSignedIn() &&
                   request.time > resource.data.updatedAt + duration.value(1, 's');
  // Máximo 1 creación/update por segundo
}
```

---

## Sistema de Invitaciones

### Flujo de Invitación

```
CREADOR DEL GRUPO
┌────────────────────────────────────────────┐
│ 1. Tap en "Crear Grupo"                   │
│ 2. Ingresar nombre: "LOS PIBES"           │
│ 3. Sistema genera código: "PB-9X4Q"       │
│ 4. Grupo creado en Firestore              │
│ 5. Pantalla muestra:                       │
│    ┌────────────────────────────────┐     │
│    │  LOS PIBES 🏆                  │     │
│    │  Código: PB-9X4Q               │     │
│    │  [Copiar] [Compartir]          │     │
│    └────────────────────────────────┘     │
└────────────────────────────────────────────┘
              │
              │ (comparte código por WhatsApp)
              ▼
AMIGO QUE SE UNE
┌────────────────────────────────────────────┐
│ 1. Tap en "Unirme a Grupo"                │
│ 2. Ingresar código: "PB-9X4Q"             │
│ 3. Sistema busca grupo en Firestore       │
│    ├─ Si existe → agregar userId a        │
│    │   members[] array                    │
│    └─ Si no existe → error "Código        │
│        inválido"                           │
│ 4. Redirect a pantalla de Grupo           │
└────────────────────────────────────────────┘
```

### Generación de Códigos

**Formato:** `XX-YYYY` (7 caracteres)

- **XX:** 2 letras derivadas del nombre del grupo
- **YYYY:** 4 caracteres alfanuméricos random

**Ejemplo:**
- "LOS PIBES" → `PB-9X4Q`
- "AMIGOS DEL BARRIO" → `AB-K3M7`
- "5TO B" → `5B-W8N2`

**Implementación:**

```javascript
// src/utils/groupCode.js
export function generateGroupCode(groupName) {
  // Extraer iniciales (solo letras/números)
  const cleanName = groupName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

  const initials = cleanName.substring(0, 2).padEnd(2, 'X');

  // Generar 4 caracteres random
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';  // Sin confusiones (0/O, 1/I)
  let random = '';
  for (let i = 0; i < 4; i++) {
    random += chars[Math.floor(Math.random() * chars.length)];
  }

  return `${initials}-${random}`;
}

// Validar unicidad
export async function ensureUniqueCode(groupName) {
  const maxAttempts = 10;

  for (let i = 0; i < maxAttempts; i++) {
    const code = generateGroupCode(groupName);

    // Verificar si ya existe
    const q = query(collection(db, 'groups'), where('code', '==', code));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return code;  // Código único encontrado
    }
  }

  throw new Error('No se pudo generar código único. Intenta de nuevo.');
}
```

### Compartir Código

**Opción 1: Copiar al portapapeles**

```javascript
function copyGroupCode(code) {
  navigator.clipboard.writeText(code);
  showToast('Código copiado!');
}
```

**Opción 2: Share API (nativo mobile)**

```javascript
async function shareGroupCode(groupName, code) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Unite a ${groupName} en Figus`,
        text: `Código del grupo: ${code}`,
        url: `https://figus.digital/join/${code}`  // Deep link
      });
    } catch (error) {
      // Usuario canceló o error
      console.log('Share cancelled');
    }
  } else {
    // Fallback: copiar
    copyGroupCode(code);
  }
}
```

### Validación de Código

```javascript
// src/services/groupService.js
export async function joinGroup(code, userId) {
  // 1. Buscar grupo por código
  const q = query(
    collection(db, 'groups'),
    where('code', '==', code.toUpperCase()),
    limit(1)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error('Código inválido');
  }

  const groupDoc = snapshot.docs[0];
  const groupData = groupDoc.data();

  // 2. Validaciones
  if (groupData.members.includes(userId)) {
    throw new Error('Ya sos miembro de este grupo');
  }

  if (groupData.memberCount >= groupData.maxMembers) {
    throw new Error('Grupo lleno (máximo 10 miembros)');
  }

  // 3. Agregar usuario al grupo
  await updateDoc(doc(db, 'groups', groupDoc.id), {
    members: arrayUnion(userId),
    memberCount: increment(1),
    lastActivityAt: Timestamp.now()
  });

  // 4. Actualizar currentGroupId del usuario
  await updateDoc(doc(db, 'users', userId), {
    currentGroupId: groupDoc.id
  });

  return groupDoc.id;
}
```

---

## Lógica de Matchmaking

### Algoritmo de Matching

**Objetivo:** Encontrar intercambios ganar-ganar entre miembros del grupo.

**Definición de "match":**
- Usuario A tiene repetidas que Usuario B necesita
- Usuario B tiene repetidas que Usuario A necesita
- Intercambio 1:1, 2:2, o N:N (balanceado)

### Pseudocódigo

```
PARA CADA usuario U en grupo:
  obtener sus repetidas: R[U]
  obtener sus faltantes: F[U]

PARA CADA par (U1, U2) donde U1 ≠ U2:
  match_give = R[U1] ∩ F[U2]    // Lo que U1 da (tiene repe y a U2 le falta)
  match_recv = R[U2] ∩ F[U1]    // Lo que U1 recibe (tiene repe y a U1 le falta)

  SI |match_give| > 0 Y |match_recv| > 0:
    crear Match(U1, U2, match_give, match_recv)
```

### Implementación en JavaScript

```javascript
// src/utils/matchmaker.js
export async function findMatches(userId, groupId) {
  // 1. Obtener todos los stickers del grupo
  const groupMembers = await getGroupMembers(groupId);
  const allStickers = await getAllStickersFromGroup(groupMembers);

  // 2. Construir maps de repetidas y faltantes
  const repeated = {};  // { userId: Set([stickerId, ...]) }
  const needed = {};

  for (const sticker of allStickers) {
    if (!repeated[sticker.userId]) repeated[sticker.userId] = new Set();
    if (!needed[sticker.userId]) needed[sticker.userId] = new Set();

    if (sticker.status === 'repeated') {
      repeated[sticker.userId].add(sticker.stickerId);
    } else if (sticker.status === 'needed') {
      needed[sticker.userId].add(sticker.stickerId);
    }
  }

  // 3. Encontrar matches para el usuario actual
  const matches = [];

  for (const otherUserId of groupMembers) {
    if (otherUserId === userId) continue;

    // Lo que yo doy (tengo repe y al otro le falta)
    const iGive = intersection(repeated[userId] || new Set(), needed[otherUserId] || new Set());

    // Lo que yo recibo (el otro tiene repe y a mí me falta)
    const iReceive = intersection(repeated[otherUserId] || new Set(), needed[userId] || new Set());

    if (iGive.size > 0 && iReceive.size > 0) {
      matches.push({
        friendId: otherUserId,
        give: Array.from(iGive),
        receive: Array.from(iReceive),
        score: iGive.size + iReceive.size  // Para ordenar por relevancia
      });
    }
  }

  // 4. Ordenar por score descendente
  matches.sort((a, b) => b.score - a.score);

  return matches;
}

function intersection(setA, setB) {
  return new Set([...setA].filter(x => setB.has(x)));
}
```

### Optimizaciones

**Problema:** Con 10 usuarios × 638 figuritas = 6,380 documentos a leer por match.

**Solución 1: Denormalización**
```javascript
// Agregar campo en /users/{userId}
{
  denormalized: {
    repeatedIds: string[],      // Máx 100 (suficiente)
    neededIds: string[],         // Máx 638
    lastSyncAt: Timestamp
  }
}
```

Ventaja: 1 lectura por usuario (10 lecturas vs 6,380).
Desventaja: Hay que mantener sincronizado.

**Solución 2: Cloud Function (futuro)**
- Ejecutar matchmaker en el servidor cada vez que alguien actualiza una figurita
- Guardar resultados en `/matches/{userId}` (precalculado)
- El cliente solo lee

**Para MVP:** Usar Solución 1 (denormalización client-side).

### Proponer Intercambio

```javascript
// src/services/matchService.js
export async function proposeTrade(data) {
  const { proposerId, receiverId, groupId, give, receive, message } = data;

  // 1. Validaciones
  if (give.length === 0 || receive.length === 0) {
    throw new Error('Intercambio debe incluir figuritas de ambos lados');
  }

  // 2. Verificar que el proposer realmente tiene las repetidas
  const proposerStickers = await getUserStickers(proposerId);
  for (const stickerId of give) {
    const sticker = proposerStickers.find(s => s.stickerId === stickerId);
    if (!sticker || sticker.status !== 'repeated') {
      throw new Error(`No tenés la figurita ${stickerId} repetida`);
    }
  }

  // 3. Crear trade en Firestore
  const tradeRef = await addDoc(collection(db, 'trades'), {
    groupId,
    albumId: 'copa-2026',
    proposerId,
    receiverId,
    proposerGives: give,
    proposerReceives: receive,
    status: 'pending',
    message: message || null,
    proposedAt: Timestamp.now(),
    respondedAt: null,
    completedAt: null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });

  return tradeRef.id;
}
```

### Responder a Propuesta

```javascript
export async function respondToTrade(tradeId, userId, accept) {
  const tradeRef = doc(db, 'trades', tradeId);
  const trade = await getDoc(tradeRef);

  if (!trade.exists()) {
    throw new Error('Intercambio no encontrado');
  }

  const data = trade.data();

  // Validar que el usuario es el receiver
  if (data.receiverId !== userId) {
    throw new Error('No tenés permiso para responder este intercambio');
  }

  if (data.status !== 'pending') {
    throw new Error('Este intercambio ya fue respondido');
  }

  // Actualizar estado
  await updateDoc(tradeRef, {
    status: accept ? 'accepted' : 'rejected',
    respondedAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });

  // Si acepta, el siguiente paso es marcar como "completed" manualmente
  // (en el MVP no se ejecuta automáticamente)
}
```

---

## Plan de Implementación por Fases

### 🏗️ Fase 0: Setup (1-2 días)

**Objetivo:** Proyecto base funcionando localmente.

**Tareas:**
1. ✅ Inicializar proyecto Vite + React
   ```bash
   npm create vite@latest figus -- --template react
   cd figus
   npm install
   ```

2. ✅ Configurar Tailwind CSS
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. ✅ Agregar fuentes Google Fonts al `index.html`:
   - Space Grotesk
   - JetBrains Mono
   - Bungee

4. ✅ Configurar custom properties CSS (`:root`) con paleta dark mode

5. ✅ Crear proyecto en Firebase Console
   - Habilitar Authentication (Google provider)
   - Crear database Firestore
   - Configurar Hosting

6. ✅ Instalar Firebase SDK
   ```bash
   npm install firebase
   ```

7. ✅ Crear `src/services/firebase.js` con configuración

8. ✅ Crear estructura de carpetas vacías

**Entregable:** `npm run dev` funciona, pantalla en blanco con colores dark mode.

---

### 🔐 Fase 1: Autenticación (2-3 días)

**Objetivo:** Login con Google funcional.

**Tareas:**
1. Implementar `authService.js`:
   - `signInWithGoogle()`
   - `signOut()`
   - `onAuthChange()`

2. Crear `AuthContext.jsx`:
   - Proveer `user`, `loading`, `signIn`, `signOut`

3. Implementar pantallas:
   - `LoginScreen.jsx` (Logo + botón "Continuar con Google")
   - `LoadingScreen.jsx` (Spinner mientras verifica auth)

4. Implementar lógica de creación de usuario nuevo:
   - Crear doc en `/users/{uid}`
   - Generar álbum inicial (638 figuritas en "needed")

5. Proteger rutas con `PrivateRoute` component

6. Agregar botón de Sign Out en perfil/settings

**Testing:**
- ✅ Login con Google funciona
- ✅ Usuario nuevo crea perfil + álbum
- ✅ Usuario existente carga su data
- ✅ Sign out limpia sesión

**Entregable:** Login funcional, no hay pantallas después del login aún.

---

### 📱 Fase 2: Layout y Navegación (2 días)

**Objetivo:** Estructura base de la app con navegación.

**Tareas:**
1. Instalar React Router
   ```bash
   npm install react-router-dom
   ```

2. Implementar componentes de layout:
   - `BottomNav.jsx` (4 tabs)
   - `TopBar.jsx` (header reutilizable)

3. Crear pantallas vacías:
   - `HomeScreen.jsx`
   - `AlbumScreen.jsx`
   - `MatchesScreen.jsx`
   - `GroupScreen.jsx` (deshabilitado por ahora)

4. Configurar rutas en `App.jsx`

5. Implementar navegación entre pantallas

6. Agregar safe areas (status bar + home indicator)

**Testing:**
- ✅ Bottom nav cambia de pantalla
- ✅ Tab activo se marca visualmente
- ✅ TopBar se adapta a cada pantalla

**Entregable:** Navegación funciona, pantallas vacías con títulos.

---

### 🎴 Fase 3: Mi Álbum - Vista y Filtros (3-4 días)

**Objetivo:** Ver y filtrar figuritas del álbum.

**Tareas:**
1. Implementar `stickerService.js`:
   - `getUserStickers(userId, albumId)`
   - `updateSticker(stickerId, updates)`

2. Crear `useStickers` hook:
   - Fetch stickers desde Firestore
   - Real-time listener para cambios
   - Calcular stats (owned, needed, repeated)

3. Implementar componentes:
   - `StickerCell.jsx` (celda con estados visuales)
   - `AlbumGrid.jsx` (grid agrupado por equipo)

4. Implementar filtros:
   - `Pill.jsx` (chip de filtro)
   - Lógica de filtrado (todas, faltantes, repetidas, especiales)

5. Agregar mini progress bar en header

6. Optimizar rendering con virtualización (`@tanstack/react-virtual`)

**Testing:**
- ✅ Grid muestra 638 figuritas
- ✅ Filtros funcionan
- ✅ Estados visuales (needed/owned/repeated) correctos
- ✅ Performance fluida (60 FPS al scrollear)

**Entregable:** Álbum visible, filtros funcionan, NO editable aún.

---

### ✏️ Fase 4: Editar Figuritas (2-3 días)

**Objetivo:** Cambiar estado de figuritas (tap → modal).

**Tareas:**
1. Implementar `StickerModal.jsx`:
   - Bottom sheet animado
   - Mostrar `PlayerFace` component
   - 3 botones de estado (needed/owned/repeated)
   - Stepper para cantidad de repetidas

2. Conectar `StickerCell` con modal:
   - `onTap` → abrir modal
   - Pasar sticker data

3. Implementar UPDATE en `stickerService.js`:
   - Actualizar doc en Firestore
   - Optimistic UI (actualizar local primero)

4. Recalcular stats al guardar:
   - Actualizar `stats` en `/users/{uid}`

5. Agregar feedback visual:
   - Animación de "guardado"
   - Toast de confirmación

**Testing:**
- ✅ Tap en celda abre modal
- ✅ Cambiar estado guarda en Firestore
- ✅ Stats se actualizan en tiempo real
- ✅ Modal se cierra con animación

**Entregable:** Álbum completamente funcional (CRUD completo).

---

### 🏠 Fase 5: Home Screen - Dashboard (2 días)

**Objetivo:** Pantalla de inicio con resumen y quick actions.

**Tareas:**
1. Implementar componentes de Home:
   - `ProgressCard.jsx` (hero card con %)
   - `StatChip.jsx` (tengo/repes/faltan)
   - `ActionTile.jsx` (abrir sobre, buscar)

2. Fetch stats desde `/users/{uid}`

3. Mostrar grupo activo (si existe)

4. Placeholder de matches (hardcodeado por ahora)

5. Streak counter (días consecutivos agregando figuritas)

**Testing:**
- ✅ Stats se actualizan al cambiar figuritas
- ✅ Progress bar refleja % real
- ✅ Botones de quick actions navegan correctamente

**Entregable:** Home funcional con stats en tiempo real.

---

### 👥 Fase 6: Grupos - Crear y Unirse (3-4 días)

**Objetivo:** Sistema de grupos con invitaciones.

**Tareas:**
1. Implementar `groupService.js`:
   - `createGroup(name, creatorId)`
   - `joinGroup(code, userId)`
   - `getGroup(groupId)`
   - `getGroupMembers(groupId)`

2. Crear `GroupScreen.jsx`:
   - Vista cuando no estás en grupo (crear/unirse)
   - Vista cuando estás en grupo (miembros, código)

3. Implementar modales:
   - `CreateGroupModal.jsx` (input nombre → genera código)
   - `JoinGroupModal.jsx` (input código → busca grupo)

4. Implementar `generateGroupCode()` en `utils/groupCode.js`

5. Agregar botones de compartir:
   - Copiar código al portapapeles
   - Share API (si disponible)

6. Mostrar miembros del grupo:
   - Avatar, nombre, % completado
   - Indicador de "online" (fake en MVP)

**Testing:**
- ✅ Crear grupo genera código único
- ✅ Unirse con código válido funciona
- ✅ Código inválido muestra error
- ✅ Miembros se ven en pantalla de grupo

**Entregable:** Grupos funcionales, usuarios pueden crear y unirse.

---

### 🔄 Fase 7: Matchmaker - Encontrar Intercambios (4-5 días)

**Objetivo:** Algoritmo que encuentra matches + UI de propuestas.

**Tareas:**
1. Implementar `matchmaker.js`:
   - `findMatches(userId, groupId)`
   - Lógica de intersección (repetidas vs needed)

2. Implementar denormalización:
   - Actualizar `users.denormalized.repeatedIds` al guardar sticker
   - Usar esos arrays en lugar de queries pesadas

3. Crear `useMatches` hook:
   - Calcular matches al montar componente
   - Recalcular cuando cambian stickers

4. Implementar `MatchesScreen.jsx`:
   - Tabs: "Posibles", "Enviados", "Hechos"
   - Lista de `MatchCard` components

5. Implementar `MatchCard.jsx`:
   - Mostrar friend, cantidad de matches (N↔M)
   - Preview de figuritas (máx 4 de cada lado)

6. Crear `MatchDetailScreen.jsx`:
   - Vista completa del match
   - SwapCard horizontales scrolleables
   - Input de mensaje opcional
   - Botón "Proponer cambio"

**Testing:**
- ✅ Matchmaker encuentra intercambios correctos
- ✅ Matches se actualizan cuando agrego figuritas
- ✅ Performance aceptable (< 2s para calcular)

**Entregable:** Matches visibles, NO se pueden proponer aún.

---

### 💬 Fase 8: Propuestas de Intercambio (3 días)

**Objetivo:** Enviar y responder propuestas.

**Tareas:**
1. Implementar `matchService.js`:
   - `proposeTrade(data)`
   - `respondToTrade(tradeId, userId, accept)`
   - `getPendingTrades(userId)`

2. Conectar botón "Proponer cambio" con Firestore

3. Implementar tab "Enviados" en MatchesScreen:
   - Listar trades con `status: 'pending'` donde `proposerId == userId`

4. Implementar notificaciones in-app:
   - Badge en BottomNav tab "Cambios"
   - Badge numérico (cantidad de pendientes)

5. Implementar respuesta a propuestas:
   - Modal de confirmación "Aceptar/Rechazar"
   - Actualizar estado en Firestore

6. Agregar tab "Hechos" (historial de trades)

**Testing:**
- ✅ Propuesta se guarda en Firestore
- ✅ Receiver ve la propuesta en su tab
- ✅ Aceptar/rechazar actualiza estado
- ✅ Badge de notificaciones funciona

**Entregable:** Sistema de propuestas completo (sin auto-ejecutar intercambio).

---

### 🎯 Fase 9: Ajustes Finales y Testing (3-4 días)

**Objetivo:** Pulir UX, corregir bugs, optimizar.

**Tareas:**
1. **Performance:**
   - Lazy load de componentes pesados
   - Code splitting por ruta
   - Memoizar componentes con `React.memo`
   - Optimizar queries de Firestore (índices)

2. **UX/UI:**
   - Animaciones de transición entre pantallas
   - Loading skeletons (no spinners genéricos)
   - Empty states con ilustraciones
   - Error states con mensajes claros

3. **Responsive:**
   - Testear en iPhone SE (375px)
   - Testear en iPhone 14 Pro Max (430px)
   - Ajustar grids/spacing si es necesario

4. **Offline:**
   - Firestore offline persistence
   - Mostrar indicador "Sin conexión"
   - Encolar acciones offline (Firestore lo hace auto)

5. **Testing manual:**
   - Crear grupo de prueba con 3-4 usuarios fake
   - Probar flujo completo end-to-end
   - Buscar edge cases y bugs

**Entregable:** App lista para deploy en staging.

---

### 🚀 Fase 10: Deploy y PWA (2 días)

**Objetivo:** App en producción en figus.digital.

**Tareas:**
1. Configurar Firebase Hosting:
   ```bash
   firebase init hosting
   npm run build
   firebase deploy
   ```

2. Configurar dominio custom:
   - Agregar `figus.digital` en Firebase Console
   - Actualizar DNS records

3. Configurar PWA:
   - Generar `manifest.json` (nombre, íconos, colores)
   - Configurar Service Worker (Workbox)
   - Testear "Add to Home Screen"

4. Generar íconos de app:
   - 192x192px
   - 512x512px
   - Formato PNG con fondo

5. Configurar Firebase Analytics (opcional):
   - Trackear eventos clave (login, add sticker, propose trade)

6. Testear en producción:
   - Probar en dispositivos reales
   - Verificar HTTPS

**Entregable:** App live en `https://figus.digital` 🎉

---

## Decisiones de Diseño Técnico

### ¿Por qué React y no Vue/Svelte?

- ✅ React tiene más recursos educativos (importante para el hijo de 14 años)
- ✅ Ecosystem más grande (más librerías compatibles)
- ✅ Hooks API es moderna y fácil de entender
- ⚠️ Trade-off: Más boilerplate que Vue, pero más flexible

**Decisión:** React + Hooks.

---

### ¿Por qué Tailwind CSS?

- ✅ Utility-first = rápido de iterar
- ✅ Diseño responsivo out-of-the-box
- ✅ No hay "cascade" problems
- ✅ Purge CSS automático (bundle pequeño)
- ⚠️ Trade-off: Clases largas en JSX

**Decisión:** Tailwind + CSS custom properties para tema.

---

### ¿Por qué NO usar TypeScript?

- ❌ Curva de aprendizaje más empinada para un adolescente
- ❌ Overhead de setup y configuración
- ✅ JavaScript puro es suficiente para un MVP
- ✅ Pueden migrar a TypeScript después si el proyecto crece

**Decisión:** JavaScript puro (ES6+).

---

### ¿Firestore o SQL?

**Firestore wins:**
- ✅ Real-time sync automático
- ✅ Offline persistence built-in
- ✅ Escalabilidad horizontal (sin sharding manual)
- ✅ No hay migraciones de schema
- ⚠️ Trade-off: Queries limitadas vs SQL

**SQL loses:**
- ❌ Requiere backend propio (Node.js + Express)
- ❌ Requiere configuración de servidor
- ❌ Real-time requiere WebSockets (complejo)

**Decisión:** Firestore.

---

### ¿Dónde ejecutar el matchmaker?

**Opción 1: Client-side (ELEGIDA para MVP)**
- ✅ Más simple de implementar
- ✅ No requiere Cloud Functions (gratis)
- ⚠️ Consume más lecturas de Firestore
- ⚠️ Performance depende del dispositivo

**Opción 2: Cloud Function**
- ✅ Mejor performance
- ✅ Puede cachear resultados
- ❌ Requiere billing en Firebase ($$)
- ❌ Más complejo de debuggear

**Decisión:** Client-side para MVP, migrar a Cloud Function si hay problemas de performance.

---

### ¿Cómo manejar imágenes de jugadores?

**MVP:** NO hay imágenes de jugadores.
- Placeholder con iniciales del nombre (ej: "ME" para Messi)
- Colores del equipo como fondo
- Ahorra bandwidth y storage

**Futuro (v2.0):**
- Subir imágenes oficiales a Firebase Storage
- Usar CDN con transformaciones automáticas (resize)
- Lazy load con placeholders

---

### ¿Notificaciones push o in-app?

**MVP:** In-app notifications solo.
- ✅ No requiere permisos del OS
- ✅ No requiere Firebase Cloud Messaging setup
- ✅ Suficiente para un MVP con pocos usuarios

**Futuro:**
- Agregar FCM para notificaciones push
- Notificar cuando un amigo acepta un intercambio

---

## Conclusión

Este Master Plan cubre:
- ✅ Arquitectura completa (Firebase + React + Tailwind)
- ✅ Modelos de datos detallados
- ✅ Flujos de autenticación y seguridad
- ✅ Sistema de invitaciones
- ✅ Algoritmo de matchmaking
- ✅ Plan de implementación en 10 fases (25-35 días de trabajo)

**Próximos pasos:**
1. Revisar y aprobar este plan
2. Configurar entorno de desarrollo (Fase 0)
3. Iniciar implementación fase por fase

**Nota para el equipo padre-hijo:**
- No traten de hacer todo de una vez
- Cada fase debe ser funcional antes de pasar a la siguiente
- Pueden ajustar el plan según aprendan cosas nuevas
- Lo importante es aprender y divertirse en el proceso

---

**¿Preguntas antes de empezar?** 🚀
