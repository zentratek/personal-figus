# 101 - Phase 1: Authentication

---
**Title:** Google OAuth Authentication
**Status:** 🟢 Approved
**Created:** 2026-05-08
**Duration:** 2-3 días

---

## Summary

Implementar autenticación con Google OAuth usando Firebase Auth. Crear contexto global de auth, pantalla de login, y protección de rutas.

## Objectives

- [ ] Usuario puede hacer login con Google (1 click)
- [ ] Estado de autenticación persiste entre recargas
- [ ] Usuario puede hacer logout
- [ ] Rutas protegidas redirigen a login si no autenticado

## Tasks

### 1. Crear AuthContext

**Implementation:**
```javascript
// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

**Files to create:**
- `src/contexts/AuthContext.jsx`

### 2. Crear LoginScreen

**Implementation:**
```javascript
// src/screens/LoginScreen.jsx
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginScreen() {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
      navigate('/'); // Redirect to home after login
    } catch (err) {
      setError('Error al iniciar sesión. Intentá de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Título */}
        <div className="text-center mb-12">
          <h1
            className="text-7xl font-bungee mb-4"
            style={{ color: 'var(--lime)' }}
          >
            FIGUS
          </h1>
          <p className="text-xl text-[var(--muted)]">
            Tu álbum digital de figuritas
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Iniciá Sesión
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border-2 border-red-500 rounded-xl text-red-500 text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-14 bg-[var(--lime)] text-black font-bold rounded-xl border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              'Cargando...'
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </>
            )}
          </button>

          <p className="text-sm text-[var(--muted)] text-center mt-6">
            Al iniciar sesión, aceptás nuestros términos y condiciones
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-[var(--muted)]">
          <p>Gestioná tu colección de figuritas</p>
          <p>Intercambiá con amigos</p>
          <p>Completá tu álbum</p>
        </div>
      </div>
    </div>
  );
}
```

**Files to create:**
- `src/screens/LoginScreen.jsx`

### 3. Crear ProtectedRoute Component

**Implementation:**
```javascript
// src/components/common/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--muted)]">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

**Files to create:**
- `src/components/common/ProtectedRoute.jsx`

### 4. Configurar React Router

**Implementation:**
```javascript
// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { LoginScreen } from './screens/LoginScreen'
import { HomeScreen } from './screens/HomeScreen'
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
```

**Files to modify:**
- `src/main.jsx`

### 5. Crear HomeScreen Temporal

**Implementation:**
```javascript
// src/screens/HomeScreen.jsx
import { useAuth } from '../contexts/AuthContext';

export function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-5xl font-bungee"
            style={{ color: 'var(--lime)' }}
          >
            FIGUS
          </h1>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-[var(--muted)]">Hola,</p>
              <p className="font-bold">{user?.displayName}</p>
            </div>
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-12 h-12 rounded-full border-2 border-[var(--primary)]"
              />
            )}
            <button
              onClick={signOut}
              className="px-4 py-2 bg-[var(--surface)] border-2 border-[var(--border)] rounded-lg hover:border-[var(--primary)] transition-colors"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¡Bienvenido a Figus! 🎉
          </h2>
          <p className="text-xl text-[var(--muted)] mb-6">
            Phase 1: Authentication ✅ Completa
          </p>
          <p className="text-[var(--muted)]">
            Próximos pasos: Navegación y Layout (Phase 2)
          </p>
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
          <p className="text-xs text-[var(--muted)] font-mono">
            User ID: {user?.uid}
          </p>
          <p className="text-xs text-[var(--muted)] font-mono">
            Email: {user?.email}
          </p>
        </div>
      </div>
    </div>
  );
}
```

**Files to create:**
- `src/screens/HomeScreen.jsx`

## Testing Checklist

- [ ] Click en "Continuar con Google" abre popup de Google
- [ ] Login exitoso redirige a HomeScreen
- [ ] Nombre y foto del usuario se muestran correctamente
- [ ] Botón "Salir" funciona y redirige a /login
- [ ] Al recargar página, usuario sigue logueado
- [ ] Intentar acceder a "/" sin login redirige a /login
- [ ] No hay errores en console

## Success Metrics

- ✅ **< 2s** tiempo de login (popup → redirect)
- ✅ **Estado persiste** después de recargar página
- ✅ **0 errores** en console
- ✅ **100%** de usuarios pueden completar login

## Deliverables

- ✅ AuthContext funcionando con Firebase Auth
- ✅ LoginScreen con diseño cyberpunk
- ✅ ProtectedRoute component
- ✅ HomeScreen temporal con info del usuario
- ✅ Usuario puede login/logout exitosamente

## Dependencies

**Requiere completar primero:**
- Phase 0: Setup ✅

**Bloquea a:**
- Phase 2: Navigation & Layout

## Open Questions

- ❓ ¿Crear usuario en Firestore al primer login?
  - **Decision:** SÍ, lo haremos en esta fase. Crear documento en `users/{uid}` con datos básicos.

## References

- [003-authentication.md](./003-authentication.md)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth/web/google-signin)
- [React Router v6 Docs](https://reactrouter.com/)

---

**Next:** [Phase 2: Navigation & Layout](./102-phase-2-navigation.md)
