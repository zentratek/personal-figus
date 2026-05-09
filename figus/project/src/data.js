// Figus mock data — fictional teams, players, matches.
// Seeded so the demo is deterministic across reloads.
window.FIGUS = (function () {
  const TEAMS = [
    { code: 'ARG', name: 'Argentina',  c1: '#6CB7FF', c2: '#FFFFFF' },
    { code: 'BRA', name: 'Brasil',     c1: '#FFE34D', c2: '#1F8A4D' },
    { code: 'URU', name: 'Uruguay',    c1: '#5DBEFF', c2: '#0A0A14' },
    { code: 'MEX', name: 'México',     c1: '#1F8A4D', c2: '#FFFFFF' },
    { code: 'COL', name: 'Colombia',   c1: '#FFCB1C', c2: '#0036A8' },
    { code: 'CHI', name: 'Chile',      c1: '#E94B4B', c2: '#1A4DDB' },
    { code: 'PER', name: 'Perú',       c1: '#F5F5FF', c2: '#E94B4B' },
    { code: 'ECU', name: 'Ecuador',    c1: '#FFD23F', c2: '#0036A8' },
    { code: 'PAR', name: 'Paraguay',   c1: '#D24343', c2: '#1A4DDB' },
    { code: 'VEN', name: 'Venezuela',  c1: '#822E2E', c2: '#FFD23F' },
    { code: 'BOL', name: 'Bolivia',    c1: '#5DA86F', c2: '#FFCB1C' },
    { code: 'USA', name: 'EE.UU.',     c1: '#5C7FFF', c2: '#E94B4B' },
    { code: 'CAN', name: 'Canadá',     c1: '#FF5C5C', c2: '#FFFFFF' },
    { code: 'CRC', name: 'Costa Rica', c1: '#3D5FFF', c2: '#E94B4B' },
    { code: 'JAM', name: 'Jamaica',    c1: '#3DD17C', c2: '#FFD23F' },
    { code: 'PAN', name: 'Panamá',     c1: '#22276B', c2: '#E94B4B' },
    { code: 'HON', name: 'Honduras',   c1: '#3DA9FF', c2: '#FFFFFF' },
    { code: 'GUA', name: 'Guatemala',  c1: '#67BFFF', c2: '#FFFFFF' },
    { code: 'SAL', name: 'El Salv.',   c1: '#3D5FFF', c2: '#FFFFFF' },
    { code: 'NIC', name: 'Nicaragua',  c1: '#3DA9FF', c2: '#FFFFFF' },
  ];

  const POSITIONS = ['POR', 'DEF', 'MED', 'DEL'];
  const FIRST = ['Lucas', 'Mateo', 'Diego', 'Ramiro', 'Tomás', 'Iván', 'Joaquín', 'Bruno', 'Federico', 'Ezequiel', 'Andrés', 'Sebastián', 'Leandro', 'Nahuel', 'Camilo', 'Emiliano', 'Juan', 'Pablo', 'Gonzalo', 'Hernán'];
  const LAST = ['Vega', 'Sastre', 'Ortega', 'Romero', 'Bravo', 'Maldonado', 'Acosta', 'Ferreyra', 'Cabral', 'Ibarra', 'Rojas', 'Cáceres', 'Fuentes', 'Núñez', 'Aguirre', 'Salinas', 'Cortez', 'Esquivel', 'Pereyra', 'Solís'];

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rng = mulberry32(7);
  const r = () => rng();
  const pick = (arr) => arr[Math.floor(r() * arr.length)];

  const SPECIAL_NUMS = new Set([7, 33, 45, 78, 91, 122, 155, 167, 188]);

  const stickers = [];
  for (let i = 0; i < TEAMS.length; i++) {
    const team = TEAMS[i];
    for (let j = 0; j < 10; j++) {
      const n = i * 10 + j + 1;
      const isSpecial = SPECIAL_NUMS.has(n);
      const roll = r();
      let state = 'needed';
      let count = 0;
      if (j === 0) state = 'owned'; // shield/captain always owned
      else if (roll < 0.32) state = 'owned';
      else if (roll < 0.46) { state = 'repeated'; count = 2 + Math.floor(r() * 4); }
      else state = 'needed';
      const name = `${pick(FIRST)} ${pick(LAST)}`;
      const pos = j === 0 ? 'ESCUDO' : pick(POSITIONS);
      stickers.push({
        n, team: team.code, name: j === 0 ? team.name.toUpperCase() : name,
        pos, state, count, special: isSpecial,
        // height/age for flavor
        age: 19 + Math.floor(r() * 16),
      });
    }
  }

  const friends = [
    { id: 'martin', name: 'Martín',  avatar: 'M', color: '#FFC700', online: true,  pct: 42 },
    { id: 'ana',    name: 'Ana',     avatar: 'A', color: '#00F0FF', online: true,  pct: 51 },
    { id: 'tomi',   name: 'Tomi',    avatar: 'T', color: '#C6FF3E', online: false, pct: 28 },
    { id: 'lara',   name: 'Lara',    avatar: 'L', color: '#FF2D8E', online: true,  pct: 64 },
    { id: 'nico',   name: 'Nico',    avatar: 'N', color: '#9B5BFF', online: false, pct: 19 },
  ];

  // Each match describes a possible swap with a friend.
  const matches = [
    { id: 'm1', friend: 'martin', give: [45, 67], receive: [12, 89] },
    { id: 'm2', friend: 'ana',    give: [33, 77, 145], receive: [5, 21, 150] },
    { id: 'm3', friend: 'tomi',   give: [88], receive: [34] },
    { id: 'm4', friend: 'lara',   give: [44, 55, 99, 132], receive: [11, 22, 78, 91] },
    { id: 'm5', friend: 'nico',   give: [101, 102], receive: [73] },
  ];

  return {
    TEAMS, stickers, friends, matches,
    albumName: 'COPA CONTINENTAL',
    albumYear: '2026',
    albumTotal: stickers.length,
    groupName: 'LOS PIBES',
    groupCode: 'PB-9X4Q',
  };
})();
