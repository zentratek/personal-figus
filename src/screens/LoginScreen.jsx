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
