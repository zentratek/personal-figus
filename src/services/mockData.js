// Mock data for Copa Mundial FIFA 2026™
// 48 selecciones × 20 stickers = 960 team stickers
// Based on official Panini album specifications

// Official 48 teams qualified for FIFA World Cup 2026™
export const TEAMS = [
  // CONMEBOL - South America (6 teams)
  { code: 'ARG', name: 'Argentina', flagCode: 'ar', color1: '#6CB7FF', color2: '#FFFFFF' },
  { code: 'BRA', name: 'Brasil', flagCode: 'br', color1: '#FFE34D', color2: '#1F8A4D' },
  { code: 'URU', name: 'Uruguay', flagCode: 'uy', color1: '#4DA8E8', color2: '#FFFFFF' },
  { code: 'COL', name: 'Colombia', flagCode: 'co', color1: '#FFE600', color2: '#003087' },
  { code: 'ECU', name: 'Ecuador', flagCode: 'ec', color1: '#FFE800', color2: '#003087' },
  { code: 'PAR', name: 'Paraguay', flagCode: 'py', color1: '#D52B1E', color2: '#FFFFFF' },

  // UEFA - Europe (16 teams)
  { code: 'ESP', name: 'España', flagCode: 'es', color1: '#AA151B', color2: '#F1BF00' },
  { code: 'GER', name: 'Alemania', flagCode: 'de', color1: '#000000', color2: '#DD0000' },
  { code: 'FRA', name: 'Francia', flagCode: 'fr', color1: '#002395', color2: '#ED2939' },
  { code: 'ENG', name: 'Inglaterra', flagCode: 'gb-eng', color1: '#FFFFFF', color2: '#CE1124' },
  { code: 'POR', name: 'Portugal', flagCode: 'pt', color1: '#FF0000', color2: '#006600' },
  { code: 'NED', name: 'Países Bajos', flagCode: 'nl', color1: '#FF4F00', color2: '#FFFFFF' },
  { code: 'BEL', name: 'Bélgica', flagCode: 'be', color1: '#FDDA24', color2: '#EF3340' },
  { code: 'CRO', name: 'Croacia', flagCode: 'hr', color1: '#FF0000', color2: '#FFFFFF' },
  { code: 'SUI', name: 'Suiza', flagCode: 'ch', color1: '#FF0000', color2: '#FFFFFF' },
  { code: 'NOR', name: 'Noruega', flagCode: 'no', color1: '#BA0C2F', color2: '#00205B' },
  { code: 'SCO', name: 'Escocia', flagCode: 'gb-sct', color1: '#0065BD', color2: '#FFFFFF' },
  { code: 'AUT', name: 'Austria', flagCode: 'at', color1: '#EF3340', color2: '#FFFFFF' },
  { code: 'SWE', name: 'Suecia', flagCode: 'se', color1: '#006AA7', color2: '#FECC00' },
  { code: 'BIH', name: 'Bosnia y Herzegovina', flagCode: 'ba', color1: '#002395', color2: '#FECB00' },
  { code: 'TUR', name: 'Turquía', flagCode: 'tr', color1: '#E30A17', color2: '#FFFFFF' },
  { code: 'CZE', name: 'Chequia', flagCode: 'cz', color1: '#D7141A', color2: '#11457E' },

  // CONCACAF - North/Central America & Caribbean (6 teams)
  { code: 'USA', name: 'Estados Unidos', flagCode: 'us', color1: '#B22234', color2: '#3C3B6E' },
  { code: 'MEX', name: 'México', flagCode: 'mx', color1: '#006847', color2: '#CE1126' },
  { code: 'CAN', name: 'Canadá', flagCode: 'ca', color1: '#FF0000', color2: '#FFFFFF' },
  { code: 'PAN', name: 'Panamá', flagCode: 'pa', color1: '#005293', color2: '#D21034' },
  { code: 'HAI', name: 'Haití', flagCode: 'ht', color1: '#D21034', color2: '#00209F' },
  { code: 'CUW', name: 'Curazao', flagCode: 'cw', color1: '#002B7F', color2: '#F9E814' },

  // CAF - Africa (10 teams)
  { code: 'MAR', name: 'Marruecos', flagCode: 'ma', color1: '#C1272D', color2: '#006233' },
  { code: 'SEN', name: 'Senegal', flagCode: 'sn', color1: '#00853F', color2: '#FDEF42' },
  { code: 'TUN', name: 'Túnez', flagCode: 'tn', color1: '#E70013', color2: '#FFFFFF' },
  { code: 'EGY', name: 'Egipto', flagCode: 'eg', color1: '#CE1126', color2: '#000000' },
  { code: 'ALG', name: 'Argelia', flagCode: 'dz', color1: '#006233', color2: '#FFFFFF' },
  { code: 'GHA', name: 'Ghana', flagCode: 'gh', color1: '#CE1126', color2: '#FCD116' },
  { code: 'CIV', name: 'Costa de Marfil', flagCode: 'ci', color1: '#F77F00', color2: '#009E60' },
  { code: 'RSA', name: 'Sudáfrica', flagCode: 'za', color1: '#007A4D', color2: '#FFB81C' },
  { code: 'CPV', name: 'Cabo Verde', flagCode: 'cv', color1: '#003893', color2: '#CF2027' },
  { code: 'COD', name: 'R.D. Congo', flagCode: 'cd', color1: '#007FFF', color2: '#F7D618' },

  // AFC - Asia (9 teams)
  { code: 'JPN', name: 'Japón', flagCode: 'jp', color1: '#BC002D', color2: '#FFFFFF' },
  { code: 'KOR', name: 'Corea del Sur', flagCode: 'kr', color1: '#003478', color2: '#CD2E3A' },
  { code: 'IRN', name: 'Irán', flagCode: 'ir', color1: '#239F40', color2: '#FFFFFF' },
  { code: 'AUS', name: 'Australia', flagCode: 'au', color1: '#00843D', color2: '#FFCD00' },
  { code: 'KSA', name: 'Arabia Saudita', flagCode: 'sa', color1: '#165B33', color2: '#FFFFFF' },
  { code: 'QAT', name: 'Qatar', flagCode: 'qa', color1: '#8D1B3D', color2: '#FFFFFF' },
  { code: 'UZB', name: 'Uzbekistán', flagCode: 'uz', color1: '#1EB53A', color2: '#0099B5' },
  { code: 'JOR', name: 'Jordania', flagCode: 'jo', color1: '#CE1126', color2: '#007A3D' },
  { code: 'IRQ', name: 'Irak', flagCode: 'iq', color1: '#CE1126', color2: '#FFFFFF' },

  // OFC - Oceania (1 team)
  { code: 'NZL', name: 'Nueva Zelanda', flagCode: 'nz', color1: '#000000', color2: '#FFFFFF' },
];

// Mock player names by position
const POSITIONS = ['DEL', 'MED', 'DEF', 'POR'];

const generatePlayerName = (team, position, index) => {
  if (position === 'BADGE') return `Escudo ${team.name}`;
  if (position === 'GROUP') return `Equipo ${team.name}`;

  // Generic player names for mock data
  const surnames = [
    'García', 'Silva', 'Santos', 'López', 'Rodríguez', 'Martínez',
    'González', 'Fernández', 'Díaz', 'Pérez', 'Sánchez', 'Ramírez',
    'Torres', 'Flores', 'Rivera', 'Gómez', 'Herrera', 'Medina'
  ];

  return `${surnames[index % surnames.length]} ${index + 1}`;
};

/**
 * Generates 960 mock stickers for the Copa Mundial FIFA 2026™
 * Now using format: COUNTRY_CODE NUMBER (e.g., ARG 1, ARG 2, ..., BRA 1, BRA 2, ...)
 * @param {string} userId - User ID for composite keys
 * @returns {Array} Array of 960 sticker objects
 */
export const generateMockStickers = (userId = 'mock-user') => {
  const stickers = [];

  TEAMS.forEach(team => {
    for (let i = 1; i <= 20; i++) {
      // New format: "ARG 1", "ARG 2", etc.
      const stickerId = `${team.code} ${i}`;
      const number = i; // Number is now 1-20 per team

      // Determine position
      let position;
      if (i === 1) position = 'BADGE';
      else if (i === 2) position = 'GROUP';
      else position = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];

      // Random status for demo (30% owned, 10% repeated, 60% needed)
      const rand = Math.random();
      let status, count;
      if (rand < 0.1) {
        status = 'repeated';
        count = Math.floor(Math.random() * 4) + 2; // 2-5 copies
      } else if (rand < 0.4) {
        status = 'owned';
        count = 1;
      } else {
        status = 'needed';
        count = 0;
      }

      stickers.push({
        id: `${userId}_copa-mundial-fifa-2026_${stickerId}`,
        userId,
        stickerId, // Now "ARG 1" format
        albumId: 'copa-mundial-fifa-2026',
        status,
        count,
        number, // Now 1-20 per team
        team: team.code,
        teamName: team.name,
        flagCode: team.flagCode,
        playerName: generatePlayerName(team, position, i),
        position,
        isSpecial: i === 1, // Badge is special (now position 1)
        color1: team.color1,
        color2: team.color2
      });
    }
  });

  return stickers;
};

/**
 * Calculate statistics from stickers array
 * @param {Array} stickers - Array of sticker objects
 * @returns {Object} Stats object
 */
export const calculateStats = (stickers) => {
  return {
    total: stickers.length,
    owned: stickers.filter(s => s.status === 'owned' || s.status === 'repeated').length,
    needed: stickers.filter(s => s.status === 'needed').length,
    repeated: stickers.filter(s => s.status === 'repeated').length,
    completionPct: Math.round(
      (stickers.filter(s => s.status === 'owned' || s.status === 'repeated').length / stickers.length) * 100
    )
  };
};

/**
 * Get team object by code
 * @param {string} code - Team code (e.g., 'ARG')
 * @returns {Object} Team object
 */
export const getTeamByCode = (code) => {
  return TEAMS.find(t => t.code === code);
};
