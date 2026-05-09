import { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../services/userService';
import { findMatches, getUserTrades } from '../services/tradeService';
import { MatchDetailModal } from '../components/trades/MatchDetailModal';

/**
 * TradesScreen - Find and manage trades with group members
 * Phase 7.1: Shows matches with tabs (Posibles/Enviados/Hechos)
 * Phase 7.2: Create proposals, view sent/received trades
 */
export function TradesScreen() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [sentTrades, setSentTrades] = useState([]);
  const [receivedTrades, setReceivedTrades] = useState([]);
  const [completedTrades, setCompletedTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('posibles');
  const [selectedMatch, setSelectedMatch] = useState(null);

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

      // Load trades
      const allTrades = await getUserTrades(user.uid);

      // Filter out trades dismissed by current user
      const notDismissed = allTrades.filter(t => {
        const dismissedBy = t.dismissedBy || [];
        return !dismissedBy.includes(user.uid);
      });

      const sent = notDismissed.filter(t => t.fromUserId === user.uid && t.status !== 'completed' && t.status !== 'accepted');
      const received = notDismissed.filter(t => t.toUserId === user.uid && t.status === 'pending');
      const completed = notDismissed.filter(t => t.status === 'completed' || t.status === 'accepted');
      setSentTrades(sent);
      setReceivedTrades(received);
      setCompletedTrades(completed);
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
      <div className="px-4 py-3.5 pb-[100px]">
        {/* Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-3.5">
          <button
            onClick={() => setSelectedTab('posibles')}
            className={`
              px-2.5 py-1.5 rounded-lg font-bold text-[10px] tracking-wide transition-all
              ${selectedTab === 'posibles'
                ? 'bg-[var(--lime)] text-black shadow-[2px_2px_0_#000]'
                : 'bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)]'
              }
            `}
          >
            POSIBLES · {matches.length}
          </button>
          <button
            onClick={() => setSelectedTab('enviados')}
            className={`
              px-2.5 py-1.5 rounded-lg font-bold text-[10px] tracking-wide transition-all
              ${selectedTab === 'enviados'
                ? 'bg-[var(--lime)] text-black shadow-[2px_2px_0_#000]'
                : 'bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)]'
              }
            `}
          >
            ENVIADOS · {sentTrades.length}
          </button>
          <button
            onClick={() => setSelectedTab('recibidos')}
            className={`
              px-2.5 py-1.5 rounded-lg font-bold text-[10px] tracking-wide transition-all
              ${selectedTab === 'recibidos'
                ? 'bg-[var(--lime)] text-black shadow-[2px_2px_0_#000]'
                : 'bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)]'
              }
            `}
          >
            RECIBIDOS · {receivedTrades.length}
          </button>
          <button
            onClick={() => setSelectedTab('hechos')}
            className={`
              px-2.5 py-1.5 rounded-lg font-bold text-[10px] tracking-wide transition-all
              ${selectedTab === 'hechos'
                ? 'bg-[var(--lime)] text-black shadow-[2px_2px_0_#000]'
                : 'bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)]'
              }
            `}
          >
            HECHOS
          </button>
        </div>

        {/* Helper text */}
        <p className="text-[10px] text-[var(--muted)] mb-3.5 font-mono tracking-wide">
          // Seleccioná las figuritas que querés intercambiar haciendo click
        </p>

        {/* Matches List - Tab: POSIBLES */}
        {selectedTab === 'posibles' && (
          <>
            {matches.length > 0 ? (
              <div className="space-y-3.5">
                {matches.map((match) => (
                  <button
                    key={match.user.id}
                    onClick={() => setSelectedMatch(match)}
                    className="w-full p-3.5 rounded-[14px] bg-[var(--surface-2)] border-2 border-[var(--border)] hover:border-[var(--lime)] transition-colors text-left shadow-[4px_4px_0_#000]"
                  >
                    {/* User Info Row */}
                    <div className="flex items-center gap-2.5 mb-3">
                      {/* Avatar */}
                      <div className="w-[42px] h-[42px] rounded-[10px] bg-[var(--lime)] flex items-center justify-center flex-shrink-0 font-bold text-black text-lg border-2 border-black shadow-[2px_2px_0_#000]">
                        {match.user.displayName?.charAt(0).toUpperCase()}
                      </div>

                      {/* Name and Album Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base truncate">{match.user.displayName}</h3>
                        <p className="text-[11px] text-[var(--muted)] font-mono">
                          {match.user.stats?.completionPct || 0}% del álbum · EN LÍNEA
                        </p>
                      </div>

                      {/* Match Badge */}
                      <div className="px-2 py-1 bg-[var(--lime)] text-black rounded-md font-bold text-xs font-mono border-2 border-black shadow-[2px_2px_0_#000] tracking-wide">
                        {match.iHave.length}↔{match.theyHave.length}
                      </div>
                    </div>

                    {/* Tags Row */}
                    <div className="bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-[10px] p-2.5 space-y-2">
                      {/* VOS DAS */}
                      <div className="flex items-center gap-2.5">
                        <span className="text-[9.5px] font-bold text-[var(--primary)] font-mono tracking-widest w-14">VOS DAS</span>
                        <div className="flex gap-1.5 flex-wrap">
                          {match.iHave.slice(0, 4).map(sticker => (
                            <span
                              key={sticker.stickerId}
                              className="px-1.5 py-0.5 bg-[var(--primary)] text-white rounded text-[11px] font-bold"
                            >
                              {sticker.number}
                            </span>
                          ))}
                          {match.iHave.length > 4 && (
                            <span className="text-[11px] text-[var(--muted)] font-mono self-center">
                              +{match.iHave.length - 4}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* RECIBES */}
                      <div className="flex items-center gap-2.5">
                        <span className="text-[9.5px] font-bold text-[var(--lime)] font-mono tracking-widest w-14">RECIBÍS</span>
                        <div className="flex gap-1.5 flex-wrap">
                          {match.theyHave.slice(0, 4).map(sticker => (
                            <span
                              key={sticker.stickerId}
                              className="px-1.5 py-0.5 bg-[var(--lime)] text-black rounded text-[11px] font-bold"
                            >
                              {sticker.number}
                            </span>
                          ))}
                          {match.theyHave.length > 4 && (
                            <span className="text-[11px] text-[var(--muted)] font-mono self-center">
                              +{match.theyHave.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
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

        {/* Tab: ENVIADOS */}
        {selectedTab === 'enviados' && (
          <>
            {sentTrades.length > 0 ? (
              <div className="space-y-3">
                {sentTrades.map((trade) => (
                  <div
                    key={trade.id}
                    className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[var(--lime)] flex items-center justify-center font-bold text-black text-sm">
                          {trade.toUserName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">Para: {trade.toUserName}</h3>
                          <p className="text-xs text-[var(--muted)]">
                            {new Date(trade.createdAt?.seconds * 1000).toLocaleDateString('es-AR')}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className={`px-2 py-1 rounded text-xs font-bold ${
                        trade.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                        trade.status === 'accepted' ? 'bg-cyan-500/20 text-cyan-500' :
                        trade.status === 'rejected' ? 'bg-red-500/20 text-red-500' :
                        'bg-[var(--muted)]/20 text-[var(--muted)]'
                      }`}>
                        {trade.status === 'pending' ? 'PENDIENTE' :
                         trade.status === 'accepted' ? 'ACEPTADO' :
                         trade.status === 'rejected' ? 'RECHAZADO' :
                         'CANCELADO'}
                      </div>
                    </div>

                    {/* Trade Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--muted)] w-20">DAS</span>
                        <div className="flex gap-1 flex-wrap">
                          {trade.offering.slice(0, 8).map((sticker, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-[var(--primary)] text-white rounded text-xs font-bold">
                              {sticker.number}
                            </span>
                          ))}
                          {trade.offering.length > 8 && (
                            <span className="px-1.5 py-0.5 bg-[var(--surface-3)] text-[var(--muted)] rounded text-xs">
                              +{trade.offering.length - 8}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--muted)] w-20">RECIBES</span>
                        <div className="flex gap-1 flex-wrap">
                          {trade.requesting.slice(0, 8).map((sticker, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-[var(--lime)] text-black rounded text-xs font-bold">
                              {sticker.number}
                            </span>
                          ))}
                          {trade.requesting.length > 8 && (
                            <span className="px-1.5 py-0.5 bg-[var(--surface-3)] text-[var(--muted)] rounded text-xs">
                              +{trade.requesting.length - 8}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {trade.status === 'pending' && (
                      <button
                        onClick={async () => {
                          if (!confirm('¿Querés cancelar esta propuesta?')) return;
                          try {
                            const { cancelTrade } = await import('../services/tradeService');
                            await cancelTrade(trade.id, user.uid);
                            loadMatches(); // Reload
                          } catch (err) {
                            console.error('Error canceling trade:', err);
                            alert('Error al cancelar la propuesta');
                          }
                        }}
                        className="w-full mt-3 py-2 rounded-lg bg-[var(--surface-3)] text-[var(--muted)] text-xs font-bold hover:bg-red-500/20 hover:text-red-500 transition-all"
                      >
                        ✕ CANCELAR PROPUESTA
                      </button>
                    )}

                    {/* Dismiss button for rejected/cancelled trades */}
                    {(trade.status === 'rejected' || trade.status === 'cancelled') && (
                      <button
                        onClick={async () => {
                          try {
                            const { dismissTrade } = await import('../services/tradeService');
                            await dismissTrade(trade.id, user.uid);
                            loadMatches(); // Reload
                          } catch (err) {
                            console.error('Error dismissing trade:', err);
                            alert('Error al descartar la propuesta');
                          }
                        }}
                        className="w-full mt-3 py-2 rounded-lg bg-[var(--surface-3)] text-[var(--muted)] text-xs font-bold hover:bg-[var(--surface-2)] transition-all"
                      >
                        DESCARTAR
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-6xl mb-4 opacity-20">📤</div>
                <h3 className="text-xl font-bold mb-2">No tenés propuestas enviadas</h3>
                <p className="text-[var(--muted)] text-center max-w-md text-sm">
                  Las propuestas de intercambio que envíes aparecerán acá.
                </p>
              </div>
            )}
          </>
        )}

        {/* Tab: RECIBIDOS */}
        {selectedTab === 'recibidos' && (
          <>
            {receivedTrades.length > 0 ? (
              <div className="space-y-3">
                {receivedTrades.map((trade) => (
                  <div
                    key={trade.id}
                    className="p-4 rounded-xl bg-[var(--surface-2)] border-2 border-[var(--lime)]"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[var(--lime)] flex items-center justify-center font-bold text-black text-sm">
                          {trade.fromUserName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">De: {trade.fromUserName}</h3>
                          <p className="text-xs text-[var(--muted)]">
                            {new Date(trade.createdAt?.seconds * 1000).toLocaleDateString('es-AR')}
                          </p>
                        </div>
                      </div>

                      {/* New Badge */}
                      <div className="px-2 py-1 rounded bg-[var(--lime)] text-black text-xs font-bold animate-pulse">
                        NUEVA
                      </div>
                    </div>

                    {/* Trade Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--muted)] w-20">TE OFRECEN</span>
                        <div className="flex gap-1 flex-wrap">
                          {trade.offering.slice(0, 8).map((sticker, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-[var(--lime)] text-black rounded text-xs font-bold">
                              {sticker.number}
                            </span>
                          ))}
                          {trade.offering.length > 8 && (
                            <span className="px-1.5 py-0.5 bg-[var(--surface-3)] text-[var(--muted)] rounded text-xs">
                              +{trade.offering.length - 8}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--muted)] w-20">TE PIDEN</span>
                        <div className="flex gap-1 flex-wrap">
                          {trade.requesting.slice(0, 8).map((sticker, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-[var(--primary)] text-white rounded text-xs font-bold">
                              {sticker.number}
                            </span>
                          ))}
                          {trade.requesting.length > 8 && (
                            <span className="px-1.5 py-0.5 bg-[var(--surface-3)] text-[var(--muted)] rounded text-xs">
                              +{trade.requesting.length - 8}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={async () => {
                          try {
                            const { acceptTrade } = await import('../services/tradeService');
                            await acceptTrade(trade.id, user.uid);
                            loadMatches(); // Reload
                          } catch (err) {
                            console.error('Error accepting trade:', err);
                            alert(err.message || 'Error al aceptar el intercambio');
                            loadMatches(); // Reload even on error to refresh state
                          }
                        }}
                        className="flex-1 py-2 rounded-lg bg-[var(--lime)] text-black font-bold shadow-[2px_2px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#000] transition-all"
                      >
                        ✓ ACEPTAR
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            const { rejectTrade } = await import('../services/tradeService');
                            await rejectTrade(trade.id, user.uid);
                            loadMatches(); // Reload
                          } catch (err) {
                            console.error('Error rejecting trade:', err);
                            alert(err.message || 'Error al rechazar el intercambio');
                            loadMatches(); // Reload even on error to refresh state
                          }
                        }}
                        className="flex-1 py-2 rounded-lg bg-[var(--surface-3)] text-[var(--muted)] font-bold hover:bg-red-500/20 hover:text-red-500 transition-all"
                      >
                        ✕ RECHAZAR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-6xl mb-4 opacity-20">📥</div>
                <h3 className="text-xl font-bold mb-2">No tenés propuestas recibidas</h3>
                <p className="text-[var(--muted)] text-center max-w-md text-sm">
                  Las propuestas que recibas de otros miembros aparecerán acá.
                </p>
              </div>
            )}
          </>
        )}

        {/* Tab: HECHOS */}
        {selectedTab === 'hechos' && (
          <>
            {completedTrades.length > 0 ? (
              <div className="space-y-3">
                {completedTrades.map((trade) => {
                  const isFromMe = trade.fromUserId === user.uid;
                  const otherUser = isFromMe ? trade.toUserName : trade.fromUserName;

                  return (
                    <div
                      key={trade.id}
                      className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--lime)]/30"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[var(--lime)]/50 flex items-center justify-center font-bold text-black text-sm">
                            {otherUser?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm">
                              {isFromMe ? `Con: ${otherUser}` : `De: ${otherUser}`}
                            </h3>
                            <p className="text-xs text-[var(--muted)]">
                              Completado: {new Date((trade.completedAt?.seconds || trade.updatedAt?.seconds || Date.now() / 1000) * 1000).toLocaleDateString('es-AR')}
                            </p>
                          </div>
                        </div>

                        {/* Completed Badge */}
                        <div className="px-2 py-1 rounded bg-[var(--lime)]/20 text-[var(--lime)] text-xs font-bold">
                          ✓ HECHO
                        </div>
                      </div>

                      {/* Trade Details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[var(--muted)] w-20">
                            {isFromMe ? 'DISTE' : 'RECIBISTE'}
                          </span>
                          <div className="flex gap-1 flex-wrap">
                            {(isFromMe ? trade.offering : trade.requesting).slice(0, 8).map((sticker, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 bg-[var(--surface-3)] text-[var(--muted)] rounded text-xs opacity-60">
                                {sticker.number}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[var(--muted)] w-20">
                            {isFromMe ? 'RECIBISTE' : 'DISTE'}
                          </span>
                          <div className="flex gap-1 flex-wrap">
                            {(isFromMe ? trade.requesting : trade.offering).slice(0, 8).map((sticker, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 bg-[var(--surface-3)] text-[var(--muted)] rounded text-xs opacity-60">
                                {sticker.number}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-6xl mb-4 opacity-20">✅</div>
                <h3 className="text-xl font-bold mb-2">No tenés intercambios completados</h3>
                <p className="text-[var(--muted)] text-center max-w-md text-sm">
                  Los intercambios que completes aparecerán acá.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Match Detail Modal */}
      {selectedMatch && (
        <MatchDetailModal
          match={selectedMatch}
          currentUserId={user.uid}
          currentUserName={userProfile?.displayName || user.displayName}
          onClose={() => {
            setSelectedMatch(null);
            loadMatches(); // Reload to show updated data
          }}
        />
      )}
    </AppLayout>
  );
}
