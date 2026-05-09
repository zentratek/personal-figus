/**
 * StatsCard - Shows album completion stats with progress bar
 * Displays: progress %, owned/repeated/needed counts
 */
export function StatsCard({ stats, total }) {
  // Calculate progress percentage
  const completionPct = total > 0 ? Math.round(((stats.owned + stats.repeated) / total) * 100) : 0;
  const ownedCount = stats.owned + stats.repeated;

  return (
    <div className="relative p-4 rounded-[14px] border-2 border-[var(--primary)] bg-[var(--surface)] overflow-hidden shadow-[4px_4px_0_#000]">
      {/* Subtle gradient background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--cyan) 100%)'
        }}
      />

      {/* Content */}
      <div className="relative">
        {/* Title */}
        <div className="mb-3">
          <h3 className="text-xs font-bold tracking-wide mb-0.5">
            COPA MUNDIAL 2026
          </h3>
          <p className="text-[9px] uppercase text-[var(--muted)] tracking-wider font-mono">FIFA WORLD CUP</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="h-1.5 bg-[var(--surface-3)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--lime)] transition-all duration-500 rounded-full"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-end justify-between">
          {/* Percentage */}
          <div>
            <div className="text-4xl font-bold text-[var(--lime)] leading-none">
              {completionPct}%
            </div>
            <div className="text-xs text-[var(--muted)] mt-0.5 font-mono">
              {ownedCount}/{total}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            {/* TENGO */}
            <div>
              <div className="text-[9px] uppercase text-[var(--muted)] mb-0.5 font-mono">Tengo</div>
              <div className="text-xl font-bold text-[var(--cyan)]">
                {ownedCount}
              </div>
            </div>

            {/* REPS */}
            <div>
              <div className="text-[9px] uppercase text-[var(--muted)] mb-0.5 font-mono">Reps</div>
              <div className="text-xl font-bold text-[var(--lime)]">
                {stats.repeated}
              </div>
            </div>

            {/* FALTAN */}
            <div>
              <div className="text-[9px] uppercase text-[var(--muted)] mb-0.5 font-mono">Faltan</div>
              <div className="text-xl font-bold text-[var(--muted)]">
                {stats.needed}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
