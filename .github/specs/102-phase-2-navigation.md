# 102 - Phase 2: Navigation & Layout

---
**Title:** Navigation & Layout Structure
**Status:** 🟢 Approved
**Created:** 2026-05-08
**Duration:** 2 días

---

## Summary

Crear la estructura de navegación de la app: Bottom Navigation con 4 tabs, TopBar con título y acciones, y Layout wrapper que envuelve todas las screens principales.

## Objectives

- [ ] Bottom Navigation funcional con 4 tabs (Home, Album, Matches, Profile)
- [ ] TopBar con título dinámico y acciones contextuales
- [ ] Layout wrapper que mantiene nav persistente
- [ ] Navegación fluida entre screens
- [ ] Diseño cyberpunk con hard shadows

## Tasks

### 1. Crear Bottom Navigation Component

**Implementation:**
```javascript
// src/components/layout/BottomNav.jsx
import { useLocation, useNavigate } from 'react-router-dom';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    {
      id: 'home',
      path: '/',
      label: 'Home',
      icon: (active) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'album',
      path: '/album',
      label: 'Álbum',
      icon: (active) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: 'matches',
      path: '/matches',
      label: 'Intercambios',
      icon: (active) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    {
      id: 'profile',
      path: '/profile',
      label: 'Perfil',
      icon: (active) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--surface)] border-t-2 border-[var(--border)] z-50">
      <div className="flex justify-around items-center h-16 max-w-screen-lg mx-auto px-4">
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-lg transition-colors ${
                active
                  ? 'text-[var(--lime)]'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {tab.icon(active)}
              <span className="text-xs font-bold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
```

**Files to create:**
- `src/components/layout/BottomNav.jsx`

### 2. Crear TopBar Component

**Implementation:**
```javascript
// src/components/layout/TopBar.jsx
import { useAuth } from '../../contexts/AuthContext';

export function TopBar({ title, actions }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 left-0 right-0 bg-[var(--surface)] border-b-2 border-[var(--border)] z-40">
      <div className="flex items-center justify-between h-16 px-4 max-w-screen-lg mx-auto">
        {/* Título */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bungee" style={{ color: 'var(--lime)' }}>
            {title}
          </h1>
        </div>

        {/* Actions + Avatar */}
        <div className="flex items-center gap-3">
          {actions}
          {user?.photoURL && (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-10 h-10 rounded-full border-2 border-[var(--primary)]"
            />
          )}
        </div>
      </div>
    </header>
  );
}
```

**Files to create:**
- `src/components/layout/TopBar.jsx`

### 3. Crear AppLayout Wrapper

**Implementation:**
```javascript
// src/components/layout/AppLayout.jsx
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';

export function AppLayout({ title, actions, children }) {
  return (
    <div className="min-h-screen pb-16">
      {/* TopBar */}
      <TopBar title={title} actions={actions} />

      {/* Main Content */}
      <main className="max-w-screen-lg mx-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
```

**Files to create:**
- `src/components/layout/AppLayout.jsx`

### 4. Crear Screens Placeholder

**Implementation:**

```javascript
// src/screens/AlbumScreen.jsx
import { AppLayout } from '../components/layout/AppLayout';

export function AlbumScreen() {
  return (
    <AppLayout title="ÁLBUM">
      <div className="p-4">
        <div className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Mi Álbum</h2>
          <p className="text-[var(--muted)]">
            Próximamente: Grid de figuritas con filtros
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
```

```javascript
// src/screens/MatchesScreen.jsx
import { AppLayout } from '../components/layout/AppLayout';

export function MatchesScreen() {
  return (
    <AppLayout title="INTERCAMBIOS">
      <div className="p-4">
        <div className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Intercambios</h2>
          <p className="text-[var(--muted)]">
            Próximamente: Matchmaker automático
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
```

```javascript
// src/screens/ProfileScreen.jsx
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../contexts/AuthContext';

export function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <AppLayout title="PERFIL">
      <div className="p-4">
        <div className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-20 h-20 rounded-full border-2 border-[var(--primary)]"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold">{user?.displayName}</h2>
              <p className="text-[var(--muted)]">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={signOut}
            className="w-full h-12 bg-red-500 text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] transition-all"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
```

**Files to create:**
- `src/screens/AlbumScreen.jsx`
- `src/screens/MatchesScreen.jsx`
- `src/screens/ProfileScreen.jsx`

### 5. Actualizar HomeScreen con Layout

**Implementation:**
```javascript
// src/screens/HomeScreen.jsx
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../contexts/AuthContext';

export function HomeScreen() {
  const { user } = useAuth();

  return (
    <AppLayout title="FIGUS">
      <div className="p-4">
        {/* Welcome Card */}
        <div className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl p-6 mb-4">
          <h2 className="text-2xl font-bold mb-2">
            ¡Hola, {user?.displayName?.split(' ')[0]}! 👋
          </h2>
          <p className="text-[var(--muted)]">
            Copa Mundial de la FIFA 2026™
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-[var(--lime)] mb-1">0</div>
            <div className="text-sm text-[var(--muted)]">Figuritas</div>
          </div>
          <div className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-[var(--primary)] mb-1">0%</div>
            <div className="text-sm text-[var(--muted)]">Completado</div>
          </div>
        </div>

        {/* CTA */}
        <button className="w-full h-14 bg-[var(--lime)] text-black font-bold rounded-xl border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] transition-all">
          Agregar Figuritas
        </button>
      </div>
    </AppLayout>
  );
}
```

**Files to modify:**
- `src/screens/HomeScreen.jsx`

### 6. Actualizar Rutas en main.jsx

**Implementation:**
```javascript
// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { LoginScreen } from './screens/LoginScreen'
import { HomeScreen } from './screens/HomeScreen'
import { AlbumScreen } from './screens/AlbumScreen'
import { MatchesScreen } from './screens/MatchesScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomeScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/album"
            element={
              <ProtectedRoute>
                <AlbumScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matches"
            element={
              <ProtectedRoute>
                <MatchesScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileScreen />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
```

**Files to modify:**
- `src/main.jsx`

## Testing Checklist

- [ ] Bottom nav visible en todas las screens principales
- [ ] Click en cada tab navega correctamente
- [ ] Tab activo se resalta con color lime
- [ ] TopBar muestra título correcto en cada screen
- [ ] Avatar del usuario visible en TopBar
- [ ] Layout responsive en móvil (375px-430px)
- [ ] No hay scrolling horizontal
- [ ] Contenido no queda oculto debajo del bottom nav

## Success Metrics

- ✅ **4 tabs funcionales** (Home, Album, Matches, Profile)
- ✅ **Navegación < 100ms** entre screens
- ✅ **0 bugs visuales** en layout
- ✅ **Design 100% según prototipo** (hard shadows, colores)

## Deliverables

- ✅ BottomNav component con 4 tabs
- ✅ TopBar component con título y avatar
- ✅ AppLayout wrapper
- ✅ 3 screens placeholder (Album, Matches, Profile)
- ✅ HomeScreen actualizado con stats cards
- ✅ Navegación fluida entre todas las screens

## Dependencies

**Requiere completar primero:**
- Phase 1: Authentication ✅

**Bloquea a:**
- Phase 3: Album View

## Open Questions

- ❓ ¿Agregar animación de transición entre screens?
  - **Decision:** NO en esta fase, mantener simple

- ❓ ¿Badge de notificaciones en tabs?
  - **Decision:** SÍ, pero en Phase 8 (Trade Proposals)

## References

- [001-architecture.md](./001-architecture.md)
- [Prototipo Figus](../../../figus/project/Figus.html)
- [CLAUDE.md](../../../docs/CLAUDE.md)

---

**Next:** [Phase 3: Album View](./103-phase-3-album.md)
