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
