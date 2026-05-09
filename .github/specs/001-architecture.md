# 001 - Technical Architecture

---
**Title:** Figus - Technical Architecture & Stack
**Status:** 🟢 Approved
**Created:** 2026-05-08
**Updated:** 2026-05-08
**Authors:** Juan, hijo
**Reviewers:** Juan

---

## Summary

Arquitectura de 3 capas usando React (frontend), Firebase (backend-as-a-service), y Tailwind CSS (styling). Todo deployed como PWA en Firebase Hosting.

## Stack Overview

```
┌──────────────────────────────────────────┐
│           FRONTEND LAYER                  │
│  ┌────────────────────────────────────┐  │
│  │ React 18 + Vite                    │  │
│  │ Tailwind CSS + CSS Custom Props    │  │
│  │ React Router 6                     │  │
│  │ Context API (state management)     │  │
│  └────────────────────────────────────┘  │
└──────────────┬───────────────────────────┘
               │ HTTPS / WebSocket
┌──────────────▼───────────────────────────┐
│          BACKEND LAYER (Firebase)        │
│  ┌────────┬────────────┬──────────────┐  │
│  │  Auth  │ Firestore  │   Hosting    │  │
│  │(Google)│  (NoSQL)   │    (CDN)     │  │
│  └────────┴────────────┴──────────────┘  │
└──────────────────────────────────────────┘
```

## Technology Decisions

### Frontend: React 18 + Vite

**Why React?**
- ✅ Ecosystem educativo extenso (recursos para adolescentes)
- ✅ Hooks API moderna y fácil de entender
- ✅ Component reusability (StickerCell usado 200+ veces)
- ✅ Padre e hijo tienen experiencia previa
- ⚠️ Trade-off: Más boilerplate que Vue, pero más flexible

**Why Vite?**
- ✅ HMR instantáneo (< 50ms)
- ✅ Build 10x más rápido que Create React App
- ✅ ESM nativo (modern browsers)
- ✅ Config minimalista

**Alternatives Considered:**
- **Vue 3:** Menos boilerplate, pero ecosystem más pequeño
- **Next.js:** Overkill para SPA pura, complejidad innecesaria
- **Svelte:** Excelente DX, pero menos recursos educativos

**Decision:** React + Vite = balance perfecto para proyecto educativo.

---

### Styling: Tailwind CSS

**Why Tailwind?**
- ✅ Utility-first = iteración rápida
- ✅ Purge CSS automático (bundle pequeño)
- ✅ Mobile-first por defecto
- ✅ No hay "cascade wars"
- ✅ Design system via `tailwind.config.js`

**Custom Properties Approach:**
```css
/* Global theme via CSS variables */
:root {
  --bg: #08080F;
  --primary: #FF2D8E;
  --lime: #C6FF3E;
  /* ... */
}

/* Uso en Tailwind */
<div className="bg-[var(--primary)]">
```

**Alternatives Considered:**
- **CSS-in-JS (styled-components):** Runtime overhead, peor performance
- **Sass/SCSS:** Build step extra, menos ergonómico que utilities
- **Vanilla CSS:** Demasiado boilerplate para proyecto grande

**Decision:** Tailwind + CSS custom props para theming.

---

### Backend: Firebase

**Why Firebase?**
- ✅ **Zero DevOps** - No configurar servidores, DB, CI/CD
- ✅ **Real-time sync** - Firestore listener updates UI automáticamente
- ✅ **Offline-first** - Persistence local built-in
- ✅ **Auth integrada** - Google OAuth en 5 líneas de código
- ✅ **Hosting + CDN** - Deploy con `firebase deploy`
- ✅ **Plan gratuito generoso** - 50K reads/day, 20K writes/day, 1GB storage

**Firebase Services Used:**

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| **Authentication** | Google OAuth | Unlimited |
| **Firestore** | NoSQL database | 50K reads/day, 20K writes/day, 1GB |
| **Hosting** | Static hosting + CDN | 10GB/month bandwidth |
| **Analytics** (optional) | Usage tracking | Unlimited |

**Cost Estimation (100 usuarios activos/día):**
- Reads: ~10K/día (bien dentro de free tier)
- Writes: ~2K/día (bien dentro de free tier)
- **Costo mensual:** $0 USD

**Alternatives Considered:**

| Alternative | Pros | Cons | Decision |
|-------------|------|------|----------|
| **Supabase** | Open-source, PostgreSQL | Requiere más setup, menos integrado | Firebase más simple |
| **Node.js + PostgreSQL** | Full control, SQL queries | Requiere servidor propio, DevOps | Demasiado complejo |
| **Amplify (AWS)** | Similar a Firebase | Más complejo, peor DX | Firebase mejor DX |

**Decision:** Firebase = mejor balance simplicidad/features para MVP educativo.

---

### State Management: Context API

**Why Context API?**
- ✅ Built-in React (no librería extra)
- ✅ Suficiente para este proyecto (1 global state: auth)
- ✅ Más fácil de entender que Redux

**State Architecture:**
```
<AuthContext>
  ├── user: User | null
  ├── loading: boolean
  ├── signIn: () => Promise<void>
  └── signOut: () => Promise<void>

<App>
  ├── Estado local de screens via useState/useReducer
  └── Custom hooks para Firestore (useStickers, useMatches)
```

**Alternatives Considered:**
- **Redux Toolkit:** Overkill, demasiado boilerplate
- **Zustand:** Excelente, pero Context API es suficiente
- **Jotai/Recoil:** Demasiado moderno, menos recursos educativos

**Decision:** Context API + custom hooks.

---

## Project Structure

```
figus/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── icons/                 # 192x192, 512x512
│   └── sw.js                  # Service Worker (Workbox)
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── BottomNav.jsx
│   │   │   ├── TopBar.jsx
│   │   │   └── StickerModal.jsx
│   │   ├── common/
│   │   │   ├── StickerCell.jsx    # Hero component
│   │   │   ├── Card.jsx
│   │   │   ├── CTA.jsx
│   │   │   └── Pill.jsx
│   │   ├── player/
│   │   │   └── PlayerFace.jsx
│   │   └── icons/
│   │       └── Icon.jsx
│   │
│   ├── screens/
│   │   ├── HomeScreen.jsx
│   │   ├── AlbumScreen.jsx
│   │   ├── MatchesScreen.jsx
│   │   └── MatchDetailScreen.jsx
│   │
│   ├── services/
│   │   ├── firebase.js          # Config
│   │   ├── authService.js       # Auth logic
│   │   ├── stickerService.js    # CRUD stickers
│   │   ├── matchService.js      # Matchmaking
│   │   └── groupService.js      # Groups
│   │
│   ├── hooks/
│   │   ├── useAuth.js           # Auth state
│   │   ├── useStickers.js       # Stickers + real-time
│   │   ├── useMatches.js        # Matchmaking logic
│   │   └── useGroup.js          # Group state
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx
│   │
│   ├── constants/
│   │   ├── colors.js
│   │   ├── stickerStates.js
│   │   └── albums.js            # Album metadata
│   │
│   ├── utils/
│   │   ├── matchmaker.js        # Matching algorithm
│   │   └── groupCode.js         # Code generator
│   │
│   ├── App.jsx
│   ├── index.css                # Tailwind + custom props
│   └── main.jsx
│
├── .env                         # Firebase config (gitignored)
├── .env.example
├── package.json
├── tailwind.config.js
├── vite.config.js
├── firebase.json                # Hosting config
└── firestore.rules              # Security rules
```

## Build & Deploy Pipeline

### Development
```bash
npm run dev           # Vite dev server (localhost:5173)
```

### Production Build
```bash
npm run build         # Vite build → dist/
npm run preview       # Preview build locally
```

### Deploy to Firebase
```bash
firebase deploy --only hosting    # Deploy app
firebase deploy --only firestore  # Deploy rules
```

### CI/CD (Future)
```yaml
# GitHub Actions workflow
on: [push]
jobs:
  deploy:
    - npm run build
    - firebase deploy --token $FIREBASE_TOKEN
```

## Performance Targets

| Metric | Target | Why |
|--------|--------|-----|
| **First Contentful Paint** | < 1.5s | Usuario ve contenido rápido |
| **Time to Interactive** | < 3s | Puede interactuar pronto |
| **Matchmaker execution** | < 2s | No bloquea UI |
| **Sticker grid render** | 60 FPS | Scroll fluido |
| **Bundle size** | < 500KB gzipped | Carga rápida en 3G |

**Optimizations:**
- Code splitting por ruta (React.lazy)
- Virtualización del grid (react-virtual)
- Memoización de componentes pesados (React.memo)
- Service Worker para cacheo agresivo
- Firestore offline persistence

## Security Considerations

### Firestore Security Rules
- Users solo pueden CRUD sus propios stickers
- Groups solo editables por miembros
- Trades solo por proposer/receiver
- Albums read-only

### Authentication
- No almacenar tokens en localStorage (Firebase SDK lo maneja)
- HTTPS obligatorio (Firebase Hosting lo garantiza)
- No exponer API keys (son públicas pero protegidas por rules)

### Input Validation
- Validación client-side + server-side (Firestore rules)
- Sanitización de inputs (nombres de grupo, mensajes)

## Monitoring & Analytics

### Firebase Analytics (Phase 10)
Track key events:
```javascript
logEvent('sticker_added', { albumId, stickerId, status });
logEvent('trade_proposed', { groupId, stickerCount });
logEvent('group_joined', { groupId });
```

### Error Tracking (Future)
- Sentry integration para crash reporting
- Console.error wrapper que reporta a backend

## Open Questions


- ⚠️ ¿Usar Cloud Functions para matchmaking?
  - **Pro:** Mejor performance, cacheo posible
  - **Con:** Requiere billing plan
  - **Decision:** Client-side para MVP, migrar si hay issues

## Success Metrics

- ✅ **Build time** < 30s en producción
- ✅ **Deploy time** < 3min
- ✅ **Lighthouse score** > 90 en todas las categorías
- ✅ **Zero** security issues en Firestore rules audit

## References

- [Data Models](./002-data-models.md)
- [Firebase Setup Guide](https://firebase.google.com/docs/web/setup)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

---

**Next Steps:**
1. Review y aprobar stack decisions
2. Leer [002-data-models.md](./002-data-models.md)
3. Ejecutar [Phase 0: Setup](./100-phase-0-setup.md)
