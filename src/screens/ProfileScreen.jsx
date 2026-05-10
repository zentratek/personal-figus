import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  const subscription = useSubscription(user?.uid);

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
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold">{user?.displayName}</h2>
                {!subscription.loading && (
                  <>
                    {subscription.isVip && (
                      <div className="inline-flex items-center gap-1 bg-[var(--lime)] text-black px-2 py-0.5 rounded-full text-xs font-bold">
                        <span>✨</span>
                        <span>VIP</span>
                      </div>
                    )}
                    {subscription.isPremium && (
                      <div className="inline-flex items-center gap-1 bg-[var(--primary)] text-white px-2 py-0.5 rounded-full text-xs font-bold">
                        <span>⭐</span>
                        <span>PREMIUM</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              <p className="text-[var(--muted)]">{user?.email}</p>

              {/* Show expiration date if has subscription */}
              {!subscription.loading && subscription.isActive && (
                <div className="text-sm text-[var(--muted)] mt-2">
                  <p>
                    Válido hasta: {subscription.expiresAt?.toLocaleDateString('es-ES')}
                  </p>
                  <p className="text-[var(--lime)] font-bold">
                    {subscription.daysUntilExpiry} días restantes
                  </p>
                </div>
              )}
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
