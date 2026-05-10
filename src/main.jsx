import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import LandingScreen from './screens/LandingScreen'
import { LoginScreen } from './screens/LoginScreen'
import { HomeScreen } from './screens/HomeScreen'
import { AlbumScreen } from './screens/AlbumScreen'
import { GroupScreen } from './screens/GroupScreen'
import { GroupSetupScreen } from './screens/GroupSetupScreen'
import { TradesScreen } from './screens/TradesScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { OcrScannerScreen } from './screens/OcrScannerScreen'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--surface-2)',
              color: 'var(--text)',
              border: '2px solid var(--border)',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: 'var(--lime)',
                secondary: 'var(--surface-2)',
              },
            },
            error: {
              iconTheme: {
                primary: 'var(--red)',
                secondary: 'var(--surface-2)',
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<LandingScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route
            path="/home"
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
            path="/grupo"
            element={
              <ProtectedRoute>
                <GroupScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grupo/setup"
            element={
              <ProtectedRoute>
                <GroupSetupScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cambios"
            element={
              <ProtectedRoute>
                <TradesScreen />
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
          <Route
            path="/scanner"
            element={
              <ProtectedRoute>
                <OcrScannerScreen />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
