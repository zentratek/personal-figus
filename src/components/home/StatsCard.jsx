/**
 * StatsCard - Shows album completion stats with progress bar
 * Displays: progress %, owned/repeated/needed counts
 */
export function StatsCard({ stats, total }) {
  // Calculate progress percentage
  const completionPct = total > 0 ? Math.round(((stats.owned + stats.repeated) / total) * 100) : 0;
  const ownedCount = stats.owned + stats.repeated;

  return (
    <div className="relative p-6 rounded-2xl border-2 border-[var(--primary)] bg-[var(--surface)] overflow-hidden">
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
        <div className="mb-4">
          <h3 className="text-sm font-bold tracking-wide mb-0.5">
            COPA MUNDIAL 2026
          </h3>
          <p className="text-[10px] uppercase text-[var(--muted)] tracking-wider">FIFA WORLD CUP</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-2 bg-[var(--surface-3)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--lime)] transition-all duration-500 rounded-full"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-end justify-between mb-6">
          {/* Percentage */}
          <div>
            <div className="text-5xl font-bold text-[var(--lime)] leading-none">
              {completionPct}%
            </div>
            <div className="text-sm text-[var(--muted)] mt-1">
              {ownedCount}/{total}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 text-center">
            {/* TENGO */}
            <div>
              <div className="text-xs uppercase text-[var(--muted)] mb-1">Tengo</div>
              <div className="text-2xl font-bold text-[var(--cyan)]">
                {ownedCount}
              </div>
            </div>

            {/* REPS */}
            <div>
              <div className="text-xs uppercase text-[var(--muted)] mb-1">Reps</div>
              <div className="text-2xl font-bold text-[var(--lime)]">
                {stats.repeated}
              </div>
            </div>

            {/* FALTAN */}
            <div>
              <div className="text-xs uppercase text-[var(--muted)] mb-1">Faltan</div>
              <div className="text-2xl font-bold text-[var(--muted)]">
                {stats.needed}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
