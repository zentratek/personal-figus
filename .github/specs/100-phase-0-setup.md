# 100 - Phase 0: Setup

---
**Title:** Project Setup & Configuration
**Status:** 🟢 Approved
**Created:** 2026-05-08
**Duration:** 1-2 días

---

## Summary
Configuración inicial del proyecto: Vite + React + Tailwind + Firebase + estructura de carpetas.

## Tasks

### 1. Inicializar Proyecto Vite
```bash
npm create vite@latest figus -- --template react
cd figus
npm install
npm run dev  # Verificar que funciona
```

### 2. Instalar Dependencias
```bash
# Core
npm install firebase react-router-dom

# Styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Utils (opcional fase 1)
npm install @tanstack/react-virtual
```

### 3. Configurar Tailwind CSS

**tailwind.config.js:**
```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        bungee: ['Bungee', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**src/index.css:**
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&family=Bungee&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #08080F;
  --surface: #14141F;
  --surface-2: #1C1C2A;
  --surface-3: #262638;
  --border: #2A2A3D;
  --primary: #FF2D8E;
  --cyan: #00F0FF;
  --lime: #C6FF3E;
  --gold: #FFC700;
  --red: #FF4D4D;
  --text: #F5F5FF;
  --muted: #6E6E85;
}

body {
  @apply bg-[var(--bg)] text-[var(--text)] font-sans antialiased;
  margin: 0;
  min-height: 100vh;
}
```

### 4. Crear Proyecto Firebase

**En Firebase Console:**
1. Ir a https://console.firebase.google.com
2. "Add Project" → Nombre: "figus-app"
3. Habilitar Google Analytics (opcional)
4. Crear proyecto

**Configurar servicios:**
```bash
# Authentication
- Enable "Google" provider

# Firestore
- Create database (test mode por ahora)
- Location: southamerica-east1 (São Paulo)

# Hosting
- Get started → configurar después
```

### 5. Configurar Firebase SDK

**Crear `.env`:**
```bash
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=figus-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=figus-app
VITE_FIREBASE_STORAGE_BUCKET=figus-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Crear `src/services/firebase.js`:**
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
```

### 6. Crear Estructura de Carpetas
```bash
mkdir -p src/{components/{layout,common,player,icons},screens,services,hooks,contexts,constants,utils}
```

### 7. Gitignore
```bash
# .gitignore
node_modules/
dist/
.env
.DS_Store
*.log
.firebase/
```

## Verification Checklist

- [ ] `npm run dev` funciona en http://localhost:5173
- [ ] Fondo dark mode (#08080F) visible
- [ ] Fuentes Google cargadas (Network tab)
- [ ] Firebase config no arroja errores en console
- [ ] `.env` está en .gitignore

## Success Metrics

- ✅ Proyecto inicia en < 5s
- ✅ HMR funciona (cambio en código se refleja instantáneamente)
- ✅ Build exitoso: `npm run build`

## References

- [Architecture](./001-architecture.md)
- [Vite Docs](https://vitejs.dev/)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)

---

**Next:** [Phase 1: Authentication](./101-phase-1-auth.md)
