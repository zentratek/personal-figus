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
