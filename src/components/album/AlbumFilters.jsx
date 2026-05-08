import { TEAMS } from '../../services/mockData';

/**
 * AlbumFilters - Filter controls for the album view
 * Includes status tabs, search input, and team dropdown
 */
export function AlbumFilters({
  selectedStatus,
  onStatusChange,
  selectedTeam,
  onTeamChange,
  searchQuery,
  onSearchChange,
  stats
}) {
  const statusTabs = [
    { id: 'all', label: 'Todas', count: stats.total, color: 'var(--text)' },
    { id: 'owned', label: 'Tengo', count: stats.owned, color: 'var(--cyan)' },
    { id: 'needed', label: 'Necesito', count: stats.needed, color: 'var(--muted)' },
    { id: 'repeated', label: 'Repetidas', count: stats.repeated, color: 'var(--lime)' }
  ];

  return (
    <div className="sticky top-0 z-10 space-y-3 p-4 bg-[var(--surface)] border-b-2 border-[var(--border)]">
      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {statusTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onStatusChange(tab.id)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap
              transition-all duration-200
              ${selectedStatus === tab.id
                ? 'bg-[var(--lime)] text-black shadow-[3px_3px_0_#000] scale-105'
                : 'bg-[var(--surface-2)] text-[var(--muted)] hover:bg-[var(--surface-3)] hover:text-[var(--text)]'
              }
            `}
          >
            {tab.label}
            <span className={`ml-2 ${selectedStatus === tab.id ? 'opacity-70' : 'opacity-50'}`}>
              ({tab.count})
            </span>
          </button>
        ))}
      </div>

      {/* Search & Team Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por número o jugador..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-[var(--surface-2)] border-2 border-[var(--border)] rounded-lg text-sm placeholder-[var(--muted)] focus:border-[var(--lime)] focus:outline-none transition-colors"
          />
          {/* Search Icon */}
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {/* Clear button */}
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Team Filter */}
        <div className="relative">
          <select
            value={selectedTeam}
            onChange={(e) => onTeamChange(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-[var(--surface-2)] border-2 border-[var(--border)] rounded-lg text-sm appearance-none cursor-pointer focus:border-[var(--primary)] focus:outline-none transition-colors"
          >
            <option value="all">Todos los equipos</option>
            <optgroup label="CONMEBOL - Sudamérica (6)" className="text-[var(--text)]">
              {TEAMS.slice(0, 6).map(team => (
                <option key={team.code} value={team.code}>
                  {team.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="UEFA - Europa (16)">
              {TEAMS.slice(6, 22).map(team => (
                <option key={team.code} value={team.code}>
                  {team.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="CONCACAF - Norteamérica (6)">
              {TEAMS.slice(22, 28).map(team => (
                <option key={team.code} value={team.code}>
                  {team.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="CAF - África (10)">
              {TEAMS.slice(28, 38).map(team => (
                <option key={team.code} value={team.code}>
                  {team.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="AFC - Asia (9)">
              {TEAMS.slice(38, 47).map(team => (
                <option key={team.code} value={team.code}>
                  {team.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="OFC - Oceanía (1)">
              {TEAMS.slice(47, 48).map(team => (
                <option key={team.code} value={team.code}>
                  {team.name}
                </option>
              ))}
            </optgroup>
          </select>
          {/* Flag Icon */}
          {selectedTeam !== 'all' && (
            <span
              className={`fi fi-${TEAMS.find(t => t.code === selectedTeam)?.flagCode} absolute left-3 top-1/2 -translate-y-1/2 text-lg`}
            />
          )}
          {selectedTeam === 'all' && (
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          )}
          {/* Dropdown arrow */}
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(searchQuery || selectedTeam !== 'all' || selectedStatus !== 'all') && (
        <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
          <span>Filtros activos:</span>
          <div className="flex gap-2 flex-wrap">
            {selectedStatus !== 'all' && (
              <span className="px-2 py-1 bg-[var(--surface-2)] rounded">
                {statusTabs.find(t => t.id === selectedStatus)?.label}
              </span>
            )}
            {selectedTeam !== 'all' && (
              <span className="px-2 py-1 bg-[var(--surface-2)] rounded flex items-center gap-1">
                <span className={`fi fi-${TEAMS.find(t => t.code === selectedTeam)?.flagCode}`} />
                {TEAMS.find(t => t.code === selectedTeam)?.name}
              </span>
            )}
            {searchQuery && (
              <span className="px-2 py-1 bg-[var(--surface-2)] rounded">
                &quot;{searchQuery}&quot;
              </span>
            )}
            <button
              onClick={() => {
                onStatusChange('all');
                onTeamChange('all');
                onSearchChange('');
              }}
              className="px-2 py-1 text-[var(--primary)] hover:underline"
            >
              Limpiar todo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
