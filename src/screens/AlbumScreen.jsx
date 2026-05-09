import { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AppLayout } from '../components/layout/AppLayout';
import { AlbumFilters } from '../components/album/AlbumFilters';
import { StickerCard } from '../components/album/StickerCard';
import { StickerModal } from '../components/album/StickerModal';
import { TeamSeparator } from '../components/album/TeamSeparator';
import { calculateStats, TEAMS } from '../services/mockData';
import { getUserStickers } from '../services/stickerService';
import { initializeUserStickers } from '../services/initializeUserStickers';
import { resetUserStickers } from '../services/resetStickers';
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

        // Check if data is in old format (contains "-" in stickerId like "ARG-001")
        // OR contains old FIFA codes (SAU, ZAF instead of KSA, RSA)
        const hasOldFormat = userStickers.some(s =>
          (s.stickerId && s.stickerId.includes('-')) ||
          (s.stickerId && (s.stickerId.startsWith('SAU ') || s.stickerId.startsWith('ZAF ')))
        );

        if (hasOldFormat) {
          console.log('⚠️  Detected old format stickers. Resetting to new FIFA codes...');
          toast('Detectamos una actualización en los códigos de país (ahora usando códigos oficiales de FIFA). Vamos a reiniciar tu álbum. Esto solo pasa una vez.', {
            duration: 5000,
            icon: '⚠️',
          });

          // Delete all old stickers
          await resetUserStickers(user.uid);

          // Initialize with new format
          await initializeUserStickers(user.uid);
          const newStickers = await getUserStickers(user.uid);
          setStickers(newStickers);
        } else if (userStickers.length === 0) {
          // No stickers at all, initialize them
          console.log('No stickers found, initializing...');
          await initializeUserStickers(user.uid);
          const newStickers = await getUserStickers(user.uid);
          setStickers(newStickers);
        } else {
          // Valid stickers with new format
          console.log('Loaded', userStickers.length, 'stickers');
          setStickers(userStickers);
        }
      } catch (error) {
        console.error('Error loading stickers:', error);
        toast.error('Error al cargar el álbum. Intenta recargar la página.');
      } finally {
        setLoading(false);
      }
    };

    loadStickers();
  }, [user.uid]);

  // Filter and sort stickers based on current filters
  const filteredStickers = useMemo(() => {
    const filtered = stickers.filter(s => {
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

    // Sort by team code (alphabetically), then by number (numerically)
    return filtered.sort((a, b) => {
      // First, sort by team code
      if (a.team !== b.team) {
        return a.team.localeCompare(b.team);
      }
      // Then sort by number (numerically, not alphabetically)
      return a.number - b.number;
    });
  }, [stickers, selectedStatus, selectedTeam, searchQuery]);

  // Group stickers by team
  const groupedStickers = useMemo(() => {
    const groups = [];
    let currentTeam = null;
    let currentGroup = null;

    for (const sticker of filteredStickers) {
      if (sticker.team !== currentTeam) {
        // Start a new group
        currentTeam = sticker.team;
        currentGroup = {
          team: sticker.team,
          stickers: [],
        };
        groups.push(currentGroup);
      }
      currentGroup.stickers.push(sticker);
    }

    return groups;
  }, [filteredStickers]);

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
      <div className="px-4 py-3.5 pb-[100px]">
        {filteredStickers.length > 0 ? (
          <>
            {/* Results count */}
            <div className="mb-3 text-xs text-[var(--muted)] font-mono">
              Mostrando {filteredStickers.length} de {stickers.length} figuritas
              {' • '}
              <span className="text-[var(--cyan)]">
                {stats.completionPct}% completado
              </span>
            </div>

            {/* Stickers Grid - Grouped by Team */}
            <div className="space-y-5">
              {groupedStickers.map(group => {
                const team = TEAMS.find(t => t.code === group.team);
                const have = group.stickers.filter(s => s.status !== 'needed').length;

                return (
                  <div key={group.team}>
                    {/* Team Separator */}
                    <TeamSeparator
                      teamCode={team?.code || group.team}
                      teamName={team?.name || group.team}
                      have={have}
                      total={group.stickers.length}
                    />

                    {/* Stickers Grid for this team */}
                    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-10 gap-2">
                      {group.stickers.map(sticker => (
                        <StickerCard
                          key={sticker.id}
                          sticker={sticker}
                          onClick={handleStickerClick}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-5xl mb-3 opacity-20">📭</div>
            <h3 className="text-lg font-bold mb-1.5">No se encontraron figuritas</h3>
            <p className="text-[var(--muted)] text-center max-w-md text-sm">
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
              className="mt-4 px-5 py-2 bg-[var(--lime)] text-black font-bold text-sm rounded-[10px] border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] transition-all"
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
