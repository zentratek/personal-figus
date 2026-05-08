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
