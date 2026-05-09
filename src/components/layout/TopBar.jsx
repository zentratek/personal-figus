/**
 * TopBar - Flexible header component
 * Supports custom left, center, and right slots OR title + actions legacy mode
 */
export function TopBar({ title, actions, left, center, right }) {
  // If custom slots are provided, use them
  if (left !== undefined || center !== undefined || right !== undefined) {
    return (
      <header className="sticky top-0 left-0 right-0 bg-[var(--surface)] border-b-2 border-[var(--border)] z-40">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left slot */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {left}
          </div>

          {/* Center slot */}
          {center && (
            <div className="flex items-center justify-center flex-shrink-0">
              {center}
            </div>
          )}

          {/* Right slot */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
            {right}
          </div>
        </div>
      </header>
    );
  }

  // Legacy mode: title + actions
  return (
    <header className="sticky top-0 left-0 right-0 bg-[var(--surface)] border-b-2 border-[var(--border)] z-40">
      <div className="flex items-center justify-between h-16 px-4 max-w-screen-lg mx-auto">
        {/* Título */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bungee" style={{ color: 'var(--lime)' }}>
            {title}
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {actions}
        </div>
      </div>
    </header>
  );
}
