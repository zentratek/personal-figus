// Map FIFA codes to flag-icons country codes
const FIFA_TO_FLAG = {
  // CONMEBOL (South America)
  'ARG': 'ar', 'BRA': 'br', 'URU': 'uy', 'CHI': 'cl', 'COL': 'co',
  'ECU': 'ec', 'PAR': 'py', 'PER': 'pe', 'VEN': 've', 'BOL': 'bo',

  // CONCACAF (North & Central America, Caribbean)
  'MEX': 'mx', 'USA': 'us', 'CAN': 'ca', 'CRC': 'cr', 'HON': 'hn',
  'JAM': 'jm', 'PAN': 'pa', 'TRI': 'tt',

  // UEFA (Europe)
  'ENG': 'gb-eng', 'FRA': 'fr', 'GER': 'de', 'ESP': 'es', 'ITA': 'it',
  'POR': 'pt', 'NED': 'nl', 'BEL': 'be', 'SUI': 'ch', 'CRO': 'hr',
  'DEN': 'dk', 'POL': 'pl', 'SRB': 'rs', 'AUT': 'at', 'CZE': 'cz',
  'WAL': 'gb-wls', 'SCO': 'gb-sct', 'SWE': 'se', 'UKR': 'ua', 'TUR': 'tr',
  'HUN': 'hu', 'SVK': 'sk', 'ROU': 'ro', 'NOR': 'no', 'GRE': 'gr',

  // AFC (Asia)
  'KOR': 'kr', 'JPN': 'jp', 'AUS': 'au', 'IRN': 'ir', 'KSA': 'sa',
  'QAT': 'qa', 'IRQ': 'iq', 'UAE': 'ae', 'UZB': 'uz', 'CHN': 'cn',
  'THA': 'th', 'VIE': 'vn', 'OMA': 'om', 'JOR': 'jo',

  // OFC (Oceania)
  'NZL': 'nz',

  // CAF (Africa)
  'MAR': 'ma', 'SEN': 'sn', 'TUN': 'tn', 'CMR': 'cm', 'GHA': 'gh',
  'NGA': 'ng', 'ALG': 'dz', 'EGY': 'eg', 'RSA': 'za', 'CIV': 'ci',
};

/**
 * TeamSeparator - Header for each team section in the album
 * Shows flag, FIFA code, team name, and progress counter
 */
export function TeamSeparator({ teamCode, teamName, have, total }) {
  const flagCode = FIFA_TO_FLAG[teamCode] || teamCode.toLowerCase();

  return (
    <div className="flex items-center gap-2.5 mb-2.5">
      {/* Flag */}
      <div className="relative w-10 h-7 rounded-md overflow-hidden border-2 border-black shadow-[2px_2px_0_#000] shrink-0">
        <span
          className={`fi fi-${flagCode}`}
          style={{
            fontSize: '28px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            lineHeight: 1,
          }}
        />
      </div>

      {/* FIFA Code Badge */}
      <div className="px-2 py-1 bg-[var(--surface-2)] border-2 border-black rounded-md font-mono font-bold text-[11px] tracking-wide shadow-[2px_2px_0_#000]">
        {teamCode}
      </div>

      {/* Team Name */}
      <div className="font-bold text-sm tracking-wide">
        {teamName.toUpperCase()}
      </div>

      {/* Separator Line */}
      <div className="flex-1 h-[2px] bg-[var(--border)] ml-1" />

      {/* Progress Counter */}
      <div className="font-mono text-[11px] text-[var(--muted)] shrink-0">
        {have}/{total}
      </div>
    </div>
  );
}
