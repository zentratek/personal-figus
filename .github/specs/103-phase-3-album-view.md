# 103 - Phase 3: Album View

---
**Title:** Phase 3: Album View - Grid de Figuritas con Filtros
**Status:** 🟢 Approved
**Created:** 2026-05-08
**Updated:** 2026-05-08
**Duration:** 3-4 días

---

## Summary

Implementar la vista principal del álbum con un grid de las 980 figuritas de la Copa Mundial FIFA 2026™, incluyendo filtros por equipo, estado (tengo/necesito/repetidas), y búsqueda. Vista read-only, sin edición de stickers en esta fase.

## Objectives

- [ ] Grid visual de 980 stickers con datos mock
- [ ] Filtros por equipo (48 selecciones)
- [ ] Filtros por estado (tengo/necesito/repetidas)
- [ ] Búsqueda por número o nombre de jugador
- [ ] Vista responsive mobile-first
- [ ] Indicadores visuales de estado con diseño cyberpunk

## Tasks

### 1. Crear Mock Data Service

Generar datos simulados de los 980 stickers para desarrollo y testing.

**Implementation:**
```javascript
// src/services/mockData.js
export const TEAMS = [
  { code: 'ARG', name: 'Argentina', color1: '#6CB7FF', color2: '#FFFFFF', range: [1, 20] },
  { code: 'BRA', name: 'Brasil', color1: '#FFE34D', color2: '#1F8A4D', range: [21, 40] },
  // ... 46 equipos más (48 total)
];

export const generateMockStickers = (userId = 'mock-user') => {
  const stickers = [];

  TEAMS.forEach(team => {
    for (let i = 0; i < 20; i++) {
      const number = team.range[0] + i;
      const stickerId = `${team.code}-${String(number).padStart(3, '0')}`;

      stickers.push({
        id: `${userId}_copa-mundial-fifa-2026_${stickerId}`,
        userId,
        stickerId,
        albumId: 'copa-mundial-fifa-2026',
        status: Math.random() < 0.3 ? 'owned' : 'needed', // 30% owned
        count: Math.random() < 0.3 ? Math.floor(Math.random() * 3) + 1 : 0,
        number,
        team: team.code,
        playerName: i === 0 ? `Escudo ${team.name}` :
                    i === 1 ? `Equipo ${team.name}` :
                    `Jugador ${number}`,
        position: i === 0 ? 'BADGE' : i === 1 ? 'GROUP' : ['DEL', 'MED', 'DEF', 'POR'][Math.floor(Math.random() * 4)],
        isSpecial: i === 0
      });
    }
  });

  return stickers;
};
```

**Files to create:**
- `src/services/mockData.js`
- `src/services/stickerService.js` (API wrapper para futuro)

### 2. Componente StickerCard

Card individual para mostrar una figurita en el grid.

**Design:**
- Estado "needed": Silueta gris con número
- Estado "owned": Card con colores del equipo y nombre
- Estado "repeated": Badge con cantidad (ej: "×3")
- Badge especial para escudos
- Hard shadow estilo cyberpunk

**Implementation:**
```javascript
// src/components/album/StickerCard.jsx
export function StickerCard({ sticker, onClick }) {
  const isOwned = sticker.status === 'owned' || sticker.status === 'repeated';
  const team = TEAMS.find(t => t.code === sticker.team);

  return (
    <button
      onClick={() => onClick(sticker)}
      className={`
        relative aspect-[2/3] rounded-lg border-2
        ${isOwned
          ? 'bg-gradient-to-br border-[var(--border)]'
          : 'bg-[var(--surface)] border-dashed border-[var(--muted)]'
        }
        hover:scale-105 transition-transform
        ${isOwned && 'shadow-[2px_2px_0_#000]'}
      `}
      style={isOwned ? {
        background: `linear-gradient(135deg, ${team.color1} 0%, ${team.color2} 100%)`
      } : {}}
    >
      {/* Número */}
      <div className="absolute top-1 left-1 text-xs font-mono font-bold">
        {sticker.number}
      </div>

      {/* Badge especial */}
      {sticker.isSpecial && (
        <div className="absolute top-1 right-1 w-4 h-4 bg-[var(--gold)] rounded-full" />
      )}

      {/* Contenido */}
      <div className="flex flex-col items-center justify-center h-full p-2">
        {isOwned ? (
          <>
            {/* Avatar/Icon del jugador */}
            <div className="w-8 h-8 rounded-full bg-black/20 mb-1" />
            {/* Nombre */}
            <p className="text-[10px] font-bold text-center line-clamp-2 text-black">
              {sticker.playerName}
            </p>
            {/* Posición */}
            <p className="text-[8px] opacity-70 text-black">
              {sticker.position}
            </p>
          </>
        ) : (
          <div className="text-3xl opacity-20">?</div>
        )}
      </div>

      {/* Badge de repetidas */}
      {sticker.status === 'repeated' && (
        <div className="absolute bottom-1 right-1 bg-[var(--lime)] text-black text-xs font-bold px-1 rounded">
          ×{sticker.count}
        </div>
      )}
    </button>
  );
}
```

**Files to create:**
- `src/components/album/StickerCard.jsx`

### 3. Componente AlbumFilters

Filtros y búsqueda para el álbum.

**Features:**
- Tabs de estado: Todas / Tengo / Necesito / Repetidas
- Dropdown de equipos (48 selecciones)
- Input de búsqueda
- Badge con contador por filtro

**Implementation:**
```javascript
// src/components/album/AlbumFilters.jsx
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
    { id: 'all', label: 'Todas', count: stats.total },
    { id: 'owned', label: 'Tengo', count: stats.owned },
    { id: 'needed', label: 'Necesito', count: stats.needed },
    { id: 'repeated', label: 'Repetidas', count: stats.repeated }
  ];

  return (
    <div className="space-y-3 p-4 bg-[var(--surface)] border-b-2 border-[var(--border)]">
      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {statusTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onStatusChange(tab.id)}
            className={`
              px-3 py-1.5 rounded-lg font-bold text-sm whitespace-nowrap
              ${selectedStatus === tab.id
                ? 'bg-[var(--lime)] text-black shadow-[2px_2px_0_#000]'
                : 'bg-[var(--surface-2)] text-[var(--muted)]'
              }
            `}
          >
            {tab.label}
            <span className="ml-1.5 opacity-70">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Buscar por número o jugador..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-3 py-2 bg-[var(--surface-2)] border-2 border-[var(--border)] rounded-lg text-sm"
      />

      {/* Team Filter */}
      <select
        value={selectedTeam}
        onChange={(e) => onTeamChange(e.target.value)}
        className="w-full px-3 py-2 bg-[var(--surface-2)] border-2 border-[var(--border)] rounded-lg text-sm"
      >
        <option value="all">Todos los equipos</option>
        {TEAMS.map(team => (
          <option key={team.code} value={team.code}>
            {team.name}
          </option>
        ))}
      </select>
    </div>
  );
}
```

**Files to create:**
- `src/components/album/AlbumFilters.jsx`

### 4. Actualizar AlbumScreen

Implementar la vista completa del álbum con grid y filtros.

**Implementation:**
```javascript
// src/screens/AlbumScreen.jsx
import { useState, useMemo } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { AlbumFilters } from '../components/album/AlbumFilters';
import { StickerCard } from '../components/album/StickerCard';
import { generateMockStickers } from '../services/mockData';

export function AlbumScreen() {
  const [stickers] = useState(() => generateMockStickers());
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter stickers
  const filteredStickers = useMemo(() => {
    return stickers.filter(s => {
      // Status filter
      if (selectedStatus !== 'all' && s.status !== selectedStatus) {
        return false;
      }

      // Team filter
      if (selectedTeam !== 'all' && s.team !== selectedTeam) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          s.number.toString().includes(query) ||
          s.playerName.toLowerCase().includes(query) ||
          s.stickerId.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [stickers, selectedStatus, selectedTeam, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: stickers.length,
      owned: stickers.filter(s => s.status === 'owned' || s.status === 'repeated').length,
      needed: stickers.filter(s => s.status === 'needed').length,
      repeated: stickers.filter(s => s.status === 'repeated').length
    };
  }, [stickers]);

  const handleStickerClick = (sticker) => {
    // TODO Phase 4: Open edit modal
    console.log('Sticker clicked:', sticker);
  };

  return (
    <AppLayout title="ÁLBUM">
      <AlbumFilters
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedTeam={selectedTeam}
        onTeamChange={setSelectedTeam}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        stats={stats}
      />

      {/* Grid */}
      <div className="p-4">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {filteredStickers.map(sticker => (
            <StickerCard
              key={sticker.id}
              sticker={sticker}
              onClick={handleStickerClick}
            />
          ))}
        </div>

        {/* Empty state */}
        {filteredStickers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--muted)] text-lg">
              No se encontraron figuritas
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
```

**Files to modify:**
- `src/screens/AlbumScreen.jsx` (reemplazar placeholder)

### 5. Optimización de Performance

Asegurar que el grid de 980 items renderice eficientemente.

**Strategies:**
- `useMemo` para filtros
- `React.memo` en `StickerCard`
- Virtual scrolling si es necesario (evaluar en testing)

**Files to modify:**
- `src/components/album/StickerCard.jsx` (agregar React.memo)

## Testing Checklist

- [ ] Grid muestra las 980 figuritas correctamente
- [ ] Filtro por estado funciona (Todas/Tengo/Necesito/Repetidas)
- [ ] Filtro por equipo muestra solo stickers del equipo seleccionado
- [ ] Búsqueda encuentra stickers por número y nombre
- [ ] Stats counters se actualizan correctamente
- [ ] Cards muestran estados visuales correctos (needed/owned/repeated)
- [ ] Badge de repetidas muestra cantidad correcta
- [ ] Badges especiales se muestran en escudos
- [ ] Responsive: grid adapta columnas según viewport
- [ ] Performance: scroll suave con 980 items
- [ ] No hay errores en console

## Success Metrics

- ✅ 980 stickers generados y mostrados
- ✅ Filtros reducen resultados correctamente
- ✅ Búsqueda responde en < 100ms
- ✅ Grid renderiza en < 1s
- ✅ Stats calculan correctamente

## Deliverables

- ✅ `StickerCard` component con estados visuales
- ✅ `AlbumFilters` component con tabs y búsqueda
- ✅ `AlbumScreen` completamente funcional
- ✅ Mock data service con 980 stickers
- ✅ Vista responsive mobile-first
- ✅ Performance optimizada

## Dependencies

**Requiere completar primero:**
- Phase 2: Navigation & Layout ✅

**Bloquea a:**
- Phase 4: Sticker Management (edición de stickers)

## Data Structure Reference

Basado en [007-copa-mundial-fifa-2026-album.md](./007-copa-mundial-fifa-2026-album.md):

```
48 selecciones × 20 stickers = 960
+ 20 stickers extra × 4 variantes = 80
= 1,040 stickers totales (980 en álbum base)
```

## Open Questions

- ✅ ¿Generar mock data o conectar a Firestore?
  - **Decision:** Mock data en Phase 3, Firestore en Phase 4

- ❓ ¿Implementar virtual scrolling?
  - **Status:** Evaluar en testing. Si performance < 60fps, implementar

- ❓ ¿Mostrar stickers extra (Action Cards) en esta vista?
  - **Status:** Pendiente. Evaluar en Phase 4

## References

- [002-data-models.md](./002-data-models.md) - Sticker schema
- [007-copa-mundial-fifa-2026-album.md](./007-copa-mundial-fifa-2026-album.md) - Official specs
- [102-phase-2-navigation.md](./102-phase-2-navigation.md) - AppLayout reference

---

**Next:** [Phase 4: Sticker Management](./104-phase-4-sticker-management.md)
