import { useNavigate } from 'react-router-dom';

/**
 * ActionButtons - Quick action buttons for main features
 * - ESCANEAR SOBRE (navigates to OCR scanner)
 * - BUSCAR (navigates to album with search)
 */
export function ActionButtons() {
  const navigate = useNavigate();

  const handleEscanearSobre = () => {
    navigate('/scanner');
  };

  const handleBuscar = () => {
    navigate('/album');
    // TODO Phase 5.1: Add query param to auto-focus search input
  };

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {/* ESCANEAR SOBRE */}
      <button
        onClick={handleEscanearSobre}
        className="flex flex-col items-center gap-2 p-3 rounded-[14px] bg-[var(--surface-2)] border-2 border-[var(--border)] shadow-[4px_4px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
      >
        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-[var(--cyan)] flex items-center justify-center border-2 border-black">
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        {/* Text */}
        <div className="text-center">
          <div className="text-xs font-bold mb-0.5">ESCANEAR SOBRE</div>
          <div className="text-[9px] text-[var(--muted)] font-mono">con cámara</div>
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
