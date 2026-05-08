import { useState, useMemo } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { AlbumFilters } from '../components/album/AlbumFilters';
import { StickerCard } from '../components/album/StickerCard';
import { generateMockStickers, calculateStats } from '../services/mockData';

export function AlbumScreen() {
  // Generate mock stickers (regenerates if TEAMS changes)
  const [stickers, setStickers] = useState(() => generateMockStickers());
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Debug: Check teams count
  console.log('Total teams:', stickers.length / 20, 'stickers:', stickers.length);

  // Filter stickers based on current filters
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
          s.stickerId.toLowerCase().includes(query) ||
          s.teamName.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [stickers, selectedStatus, selectedTeam, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => calculateStats(stickers), [stickers]);

  const handleStickerClick = (sticker) => {
    // TODO Phase 4: Open edit modal
    console.log('Sticker clicked:', sticker);
  };

  return (
    <AppLayout title="ÁLBUM">
      {/* Filters */}
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
      <div className="p-4 pb-24">
        {filteredStickers.length > 0 ? (
          <>
            {/* Results count */}
            <div className="mb-4 text-sm text-[var(--muted)]">
              Mostrando {filteredStickers.length} de {stickers.length} figuritas
              {' • '}
              <span className="text-[var(--cyan)]">
                {stats.completionPct}% completado
              </span>
            </div>

            {/* Stickers Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {filteredStickers.map(sticker => (
                <StickerCard
                  key={sticker.id}
                  sticker={sticker}
                  onClick={handleStickerClick}
                />
              ))}
            </div>
          </>
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4 opacity-20">📭</div>
            <h3 className="text-xl font-bold mb-2">No se encontraron figuritas</h3>
            <p className="text-[var(--muted)] text-center max-w-md">
              {searchQuery
                ? `No hay resultados para "${searchQuery}"`
                : selectedTeam !== 'all'
                  ? 'Intenta con otro equipo o cambia los filtros'
                  : 'Intenta con otros filtros'}
            </p>
            <button
              onClick={() => {
                setSelectedStatus('all');
                setSelectedTeam('all');
                setSearchQuery('');
              }}
              className="mt-6 px-6 py-2 bg-[var(--lime)] text-black font-bold rounded-lg border-2 border-black shadow-[3px_3px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] transition-all"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
