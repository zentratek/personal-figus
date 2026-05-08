import { useNavigate } from 'react-router-dom';

/**
 * ActionButtons - Quick action buttons for main features
 * - ABRIR SOBRE (Phase 7 - placeholder)
 * - BUSCAR (navigates to album with search)
 */
export function ActionButtons() {
  const navigate = useNavigate();

  const handleAbrirSobre = () => {
    alert('Próximamente: ¡Abrí sobres y sumá figuritas al álbum!');
  };

  const handleBuscar = () => {
    navigate('/album');
    // TODO Phase 5.1: Add query param to auto-focus search input
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* ABRIR SOBRE */}
      <button
        onClick={handleAbrirSobre}
        className="flex flex-col items-center gap-3 p-4 rounded-xl bg-[var(--surface-2)] border-2 border-[var(--border)] hover:scale-105 active:scale-95 transition-transform"
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-[var(--cyan)] flex items-center justify-center">
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
        </div>

        {/* Text */}
        <div className="text-center">
          <div className="text-sm font-bold mb-0.5">ABRIR SOBRE</div>
          <div className="text-xs text-[var(--muted)]">Canjear 5 figuritas</div>
        </div>
      </button>

      {/* BUSCAR */}
      <button
        onClick={handleBuscar}
        className="flex flex-col items-center gap-3 p-4 rounded-xl bg-[var(--surface-2)] border-2 border-[var(--border)] hover:scale-105 active:scale-95 transition-transform"
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-[var(--gold)] flex items-center justify-center">
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Text */}
        <div className="text-center">
          <div className="text-sm font-bold mb-0.5">BUSCAR</div>
          <div className="text-xs text-[var(--muted)]">por número</div>
        </div>
      </button>
    </div>
  );
}
