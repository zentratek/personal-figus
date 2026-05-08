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
