import { useState, useMemo, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { AlbumFilters } from '../components/album/AlbumFilters';
import { StickerCard } from '../components/album/StickerCard';
import { StickerModal } from '../components/album/StickerModal';
import { calculateStats } from '../services/mockData';
import { getUserStickers } from '../services/stickerService';
import { initializeUserStickers } from '../services/initializeUserStickers';
import { useAuth } from '../contexts/AuthContext';

export function AlbumScreen() {
  const { user } = useAuth();
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load stickers from Firestore
  useEffect(() => {
    const loadStickers = async () => {
      try {
        console.log('Loading stickers for user:', user.uid);
        const userStickers = await getUserStickers(user.uid);

        // If no stickers, initialize them
        if (userStickers.length === 0) {
          console.log('No stickers found, initializing...');
          await initializeUserStickers(user.uid);
          const newStickers = await getUserStickers(user.uid);
          setStickers(newStickers);
        } else {
          console.log('Loaded', userStickers.length, 'stickers');
          setStickers(userStickers);
        }
      } catch (error) {
        console.error('Error loading stickers:', error);
        alert('Error al cargar el álbum. Intenta recargar la página.');
      } finally {
        setLoading(false);
      }
    };

    loadStickers();
  }, [user.uid]);

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
    setSelectedSticker(sticker);
  };

  const handleStickerUpdate = (updatedSticker) => {
    setStickers(prev =>
      prev.map(s => s.id === updatedSticker.id ? updatedSticker : s)
    );
  };

  // Loading state
  if (loading) {
    return (
      <AppLayout title="ÁLBUM">
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <svg className="animate-spin h-12 w-12 text-[var(--lime)] mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-[var(--muted)] text-lg">Cargando álbum...</p>
        </div>
      </AppLayout>
    );
  }

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

      {/* Sticker Edit Modal */}
      {selectedSticker && (
        <StickerModal
          sticker={selectedSticker}
          onClose={() => setSelectedSticker(null)}
          onUpdate={handleStickerUpdate}
        />
      )}
    </AppLayout>
  );
}
