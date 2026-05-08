import { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../services/userService';
import { findMatches } from '../services/tradeService';

/**
 * TradesScreen - Find and manage trades with group members
 * Phase 7.1: Shows matches with tabs (Posibles/Enviados/Hechos)
 */
export function TradesScreen() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('posibles');

  useEffect(() => {
    loadMatches();
  }, [user.uid]);

  const loadMatches = async () => {
    try {
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);

      if (!profile.groupId) {
        setLoading(false);
        return;
      }

      const matchData = await findMatches(user.uid, profile.groupId);
      setMatches(matchData);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <AppLayout title="CAMBIOS">
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <svg className="animate-spin h-12 w-12 text-[var(--lime)] mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-[var(--muted)] text-lg">Buscando intercambios...</p>
        </div>
      </AppLayout>
    );
  }

  // No group state
  if (!userProfile?.groupId) {
    return (
      <AppLayout title="CAMBIOS">
        <div className="flex flex-col items-center justify-center h-[60vh] p-4">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold mb-2 text-center">Unite a un Grupo</h2>
          <p className="text-[var(--muted)] text-center max-w-md">
            Necesitás estar en un grupo para intercambiar figuritas con tus amigos.
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="MATCHMAKER">
      <div className="p-4 pb-24">
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSelectedTab('posibles')}
            className={`
              flex-1 px-4 py-2 rounded-lg font-bold text-sm transition-all
              ${selectedTab === 'posibles'
                ? 'bg-[var(--lime)] text-black'
                : 'bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)]'
              }
            `}
          >
            POSIBLES · {matches.length}
          </button>
          <button
            onClick={() => setSelectedTab('enviados')}
            className={`
              flex-1 px-4 py-2 rounded-lg font-bold text-sm transition-all
              ${selectedTab === 'enviados'
                ? 'bg-[var(--lime)] text-black'
                : 'bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)]'
              }
            `}
          >
            ENVIADOS
          </button>
          <button
            onClick={() => setSelectedTab('hechos')}
            className={`
              flex-1 px-4 py-2 rounded-lg font-bold text-sm transition-all
              ${selectedTab === 'hechos'
                ? 'bg-[var(--lime)] text-black'
                : 'bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)]'
              }
            `}
          >
            HECHOS
          </button>
        </div>

        {/* Helper text */}
        <p className="text-xs text-[var(--muted)] mb-4 font-mono">
          // Figuritas que vos tenés repe y a tus amigos les faltan
        </p>

        {/* Matches List - Tab: POSIBLES */}
        {selectedTab === 'posibles' && (
          <>
            {matches.length > 0 ? (
              <div className="space-y-3">
                {matches.map((match) => (
                  <div
                    key={match.user.id}
                    className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]"
                  >
                    {/* User Info Row */}
                    <div className="flex items-center gap-3 mb-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-[var(--lime)] flex items-center justify-center flex-shrink-0 font-bold text-black text-lg">
                        {match.user.displayName?.charAt(0).toUpperCase()}
                      </div>

                      {/* Name and Album Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm truncate">{match.user.displayName}</h3>
                        <p className="text-xs text-[var(--muted)]">
                          {match.user.stats?.completionPct || 0}% del Álbum - EN LÍNEA
                        </p>
                      </div>

                      {/* Match Badge */}
                      <div className="px-3 py-1 bg-[var(--lime)] text-black rounded-lg font-bold text-sm">
                        {match.iHave.length}+{match.theyHave.length}
                      </div>
                    </div>

                    {/* Tags Row */}
                    <div className="space-y-2">
                      {/* VOS DAS */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--muted)] w-20">VOS DAS</span>
                        <div className="flex gap-2 flex-wrap">
                          {match.iHave.slice(0, 5).map(sticker => (
                            <span
                              key={sticker.stickerId}
                              className="px-2 py-1 bg-[var(--primary)] text-white rounded text-xs font-bold"
                            >
                              {sticker.number}
                            </span>
                          ))}
                          {match.iHave.length > 5 && (
                            <span className="px-2 py-1 bg-[var(--surface-3)] text-[var(--muted)] rounded text-xs">
                              +{match.iHave.length - 5}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* RECIBES */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--muted)] w-20">RECIBES</span>
                        <div className="flex gap-2 flex-wrap">
                          {match.theyHave.slice(0, 5).map(sticker => (
                            <span
                              key={sticker.stickerId}
                              className="px-2 py-1 bg-[var(--lime)] text-black rounded text-xs font-bold"
                            >
                              {sticker.number}
                            </span>
                          ))}
                          {match.theyHave.length > 5 && (
                            <span className="px-2 py-1 bg-[var(--surface-3)] text-[var(--muted)] rounded text-xs">
                              +{match.theyHave.length - 5}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Empty state
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-6xl mb-4 opacity-20">🔍</div>
                <h3 className="text-xl font-bold mb-2">No hay matches disponibles</h3>
                <p className="text-[var(--muted)] text-center max-w-md text-sm">
                  Aún no hay miembros del grupo con figuritas compatibles.
                  <br />
                  ¡Sigue cargando tu álbum!
                </p>
              </div>
            )}
          </>
        )}

        {/* Tab: ENVIADOS (placeholder) */}
        {selectedTab === 'enviados' && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4 opacity-20">📤</div>
            <h3 className="text-xl font-bold mb-2">No tenés propuestas enviadas</h3>
            <p className="text-[var(--muted)] text-center max-w-md text-sm">
              Las propuestas de intercambio que envíes aparecerán acá.
            </p>
          </div>
        )}

        {/* Tab: HECHOS (placeholder) */}
        {selectedTab === 'hechos' && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4 opacity-20">✅</div>
            <h3 className="text-xl font-bold mb-2">No tenés intercambios completados</h3>
            <p className="text-[var(--muted)] text-center max-w-md text-sm">
              Los intercambios que completes aparecerán acá.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
