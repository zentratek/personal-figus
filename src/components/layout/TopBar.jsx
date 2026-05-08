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
