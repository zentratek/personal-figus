/**
 * MatchesCard - Shows today's possible trades
 * Phase 5: Placeholder with mock data
 * Phase 6: Real matching algorithm
 */
export function MatchesCard() {
  const handleClick = () => {
    alert('Próximamente: ¡Sistema de intercambios con tus amigos!');
  };

  return (
    <button
      onClick={handleClick}
      className="w-full p-4 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[#FF5DA8] border-2 border-black shadow-[3px_3px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center gap-4"
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center flex-shrink-0">
        <svg className="w-6 h-6 text-[var(--lime)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth={2} />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4M2 12h4m12 0h4" />
        </svg>
      </div>

      {/* Text */}
      <div className="flex-1 text-left">
        <div className="text-sm font-bold text-black">
          <span className="text-base">5 cambios posibles</span> con 3 amigos - ahora
        </div>
      </div>

      {/* Arrow */}
      <div className="text-black text-2xl flex-shrink-0">
        →
      </div>
    </button>
  );
}
