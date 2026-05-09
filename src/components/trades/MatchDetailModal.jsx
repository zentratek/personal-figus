import { useState } from 'react';
import { TradeProposalModal } from './TradeProposalModal';

/**
 * MatchDetailModal - Shows complete match details and allows creating trade proposals
 * Phase 7.2: Full view of all compatible stickers
 */
export function MatchDetailModal({ match, onClose, currentUserId, currentUserName }) {
  const [showProposalModal, setShowProposalModal] = useState(false);

  if (!match) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center justify-center"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-[var(--surface)] rounded-t-[20px] md:rounded-2xl w-full md:max-w-xl max-h-[90vh] overflow-hidden flex flex-col border-2 border-[var(--border)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-3.5 border-b-2 border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Avatar */}
              <div className="w-[42px] h-[42px] rounded-[10px] bg-[var(--lime)] flex items-center justify-center font-bold text-black text-lg border-2 border-black shadow-[2px_2px_0_#000]">
                {match.user.displayName?.charAt(0).toUpperCase()}
              </div>

              {/* User Info */}
              <div>
                <h2 className="text-base font-bold">{match.user.displayName}</h2>
                <p className="text-[11px] text-[var(--muted)] font-mono">
                  {match.user.stats?.completionPct || 0}% del álbum
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--surface-3)] transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
            {/* Match Score */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[#FF5DA8] border-2 border-black text-center">
              <div className="text-3xl font-bold text-black mb-1">
                {match.iHave.length} + {match.theyHave.length}
              </div>
              <div className="text-sm font-bold text-black/70">
                FIGURITAS COMPATIBLES
              </div>
            </div>

            {/* VOS DAS Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-[var(--muted)]">LAS QUE TENÉS REPETIDAS</span>
                <span className="text-xs text-[var(--muted)]">({match.iHave.length})</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {match.iHave.map((sticker) => (
                  <div
                    key={sticker.stickerId}
                    className="p-2 rounded-lg bg-[var(--primary)] text-white text-center"
                  >
                    <div className="font-bold text-sm">{sticker.number}</div>
                    <div className="text-xs opacity-75 truncate">{sticker.playerName}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RECIBES Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-[var(--muted)]">LAS QUE {match.user.displayName?.toUpperCase()} TIENE REPETIDAS</span>
                <span className="text-xs text-[var(--muted)]">({match.theyHave.length})</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {match.theyHave.map((sticker) => (
                  <div
                    key={sticker.stickerId}
                    className="p-2 rounded-lg bg-[var(--lime)] text-black text-center"
                  >
                    <div className="font-bold text-sm">{sticker.number}</div>
                    <div className="text-xs opacity-75 truncate">{sticker.playerName}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Helper Text */}
            <p className="text-xs text-[var(--muted)] font-mono text-center">
              // Click "Proponer Intercambio" para seleccionar figuritas específicas
            </p>
          </div>

          {/* Footer */}
          <div className="p-4 border-t-2 border-[var(--border)] space-y-2">
            <button
              onClick={() => setShowProposalModal(true)}
              className="w-full py-3 rounded-xl bg-[var(--lime)] text-black font-bold shadow-[3px_3px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
            >
              PROPONER INTERCAMBIO
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl bg-[var(--surface-2)] text-[var(--muted)] font-bold hover:bg-[var(--surface-3)] transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Trade Proposal Modal */}
      {showProposalModal && (
        <TradeProposalModal
          match={match}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          onClose={() => setShowProposalModal(false)}
          onSuccess={() => {
            setShowProposalModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
