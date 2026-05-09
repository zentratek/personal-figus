import { useNavigate } from 'react-router-dom';

/**
 * ActionButtons - Quick action buttons for main features
 * - ABRIR SOBRE (navigates to OCR scanner)
 * - BUSCAR (navigates to album with search)
 */
export function ActionButtons() {
  const navigate = useNavigate();

  const handleAbrirSobre = () => {
    navigate('/scanner');
  };

  const handleBuscar = () => {
    navigate('/album');
    // TODO Phase 5.1: Add query param to auto-focus search input
  };

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {/* ABRIR SOBRE */}
      <button
        onClick={handleAbrirSobre}
        className="flex flex-col items-center gap-2 p-3 rounded-[14px] bg-[var(--surface-2)] border-2 border-[var(--border)] shadow-[4px_4px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
      >
        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-[var(--cyan)] flex items-center justify-center border-2 border-black">
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
        </div>

        {/* Text */}
        <div className="text-center">
          <div className="text-xs font-bold mb-0.5">ABRIR SOBRE</div>
          <div className="text-[9px] text-[var(--muted)] font-mono">Canjear 5 figuritas</div>
        </div>
      </button>

      {/* BUSCAR */}
      <button
        onClick={handleBuscar}
        className="flex flex-col items-center gap-2 p-3 rounded-[14px] bg-[var(--surface-2)] border-2 border-[var(--border)] shadow-[4px_4px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
      >
        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-[var(--gold)] flex items-center justify-center border-2 border-black">
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Text */}
        <div className="text-center">
          <div className="text-xs font-bold mb-0.5">BUSCAR</div>
          <div className="text-[9px] text-[var(--muted)] font-mono">por número</div>
        </div>
      </button>
    </div>
  );
}
