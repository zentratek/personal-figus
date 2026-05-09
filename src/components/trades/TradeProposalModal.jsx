import { useState } from 'react';
import { createTrade } from '../../services/tradeService';

/**
 * TradeProposalModal - Create a trade proposal with specific stickers
 * Phase 7.2: Select stickers to offer/request and send proposal
 */
export function TradeProposalModal({ match, currentUserId, currentUserName, onClose, onSuccess }) {
  const [selectedOffering, setSelectedOffering] = useState([]);
  const [selectedRequesting, setSelectedRequesting] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchOffering, setSearchOffering] = useState('');
  const [searchRequesting, setSearchRequesting] = useState('');

  const toggleOffering = (sticker) => {
    setSelectedOffering(prev =>
      prev.some(s => s.stickerId === sticker.stickerId)
        ? prev.filter(s => s.stickerId !== sticker.stickerId)
        : [...prev, sticker]
    );
  };

  const toggleRequesting = (sticker) => {
    setSelectedRequesting(prev =>
      prev.some(s => s.stickerId === sticker.stickerId)
        ? prev.filter(s => s.stickerId !== sticker.stickerId)
        : [...prev, sticker]
    );
  };

  // Filter functions
  const filteredOffering = match.iHave.filter(sticker =>
    sticker.number.toString().includes(searchOffering) ||
    sticker.playerName.toLowerCase().includes(searchOffering.toLowerCase())
  );

  const filteredRequesting = match.theyHave.filter(sticker =>
    sticker.number.toString().includes(searchRequesting) ||
    sticker.playerName.toLowerCase().includes(searchRequesting.toLowerCase())
  );

  const handleSubmit = async () => {
    // Validation
    if (selectedOffering.length === 0 || selectedRequesting.length === 0) {
      setError('Debes seleccionar al menos 1 figurita para dar y 1 para recibir');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createTrade(
        currentUserId,
        currentUserName,
        match.user.id,
        match.user.displayName,
        selectedOffering,
        selectedRequesting,
        '' // No message for child safety
      );

      onSuccess();
    } catch (err) {
      console.error('Error creating trade:', err);
      setError('Error al enviar propuesta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 z-[60] flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="bg-[var(--surface)] rounded-t-3xl md:rounded-2xl w-full md:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b-2 border-[var(--border)]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">PROPONER INTERCAMBIO</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[var(--surface-2)] flex items-center justify-center hover:bg-[var(--surface-3)] transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-[var(--muted)]">
            Con: <span className="text-[var(--lime)] font-bold">{match.user.displayName}</span>
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* VOS DAS Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-sm font-bold">LAS QUE TENÉS REPETIDAS</div>
                <div className="text-xs text-[var(--muted)]">{match.iHave.length} disponibles</div>
              </div>
              <div className="px-3 py-1 rounded-lg bg-[var(--primary)]/20 text-[var(--primary)] text-sm font-bold">
                {selectedOffering.length} ✓
              </div>
            </div>

            {/* Search Input */}
            {match.iHave.length > 10 && (
              <input
                type="text"
                value={searchOffering}
                onChange={(e) => setSearchOffering(e.target.value)}
                placeholder="🔍 Buscar por número o jugador..."
                className="w-full mb-2 px-3 py-2 rounded-lg bg-[var(--surface-3)] border border-[var(--border)] focus:border-[var(--primary)] outline-none text-sm"
              />
            )}

            <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto">
              {filteredOffering.length > 0 ? (
                filteredOffering.map((sticker) => {
                  const isSelected = selectedOffering.some(s => s.stickerId === sticker.stickerId);
                  return (
                    <button
                      key={sticker.stickerId}
                      onClick={() => toggleOffering(sticker)}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'bg-[var(--primary)] border-[var(--primary)] text-white scale-95'
                          : 'bg-[var(--surface-2)] border-[var(--border)] hover:border-[var(--primary)]'
                      }`}
                    >
                      <div className="font-bold text-sm">{sticker.number}</div>
                      <div className="text-xs opacity-75 truncate">{sticker.playerName}</div>
                      {isSelected && <div className="text-lg mt-1">✓</div>}
                    </button>
                  );
                })
              ) : (
                <div className="col-span-4 text-center py-4 text-[var(--muted)] text-sm">
                  No se encontraron figuritas con "{searchOffering}"
                </div>
              )}
            </div>
          </div>

          {/* RECIBES Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-sm font-bold">LAS QUE {match.user.displayName?.toUpperCase()} TIENE REPETIDAS</div>
                <div className="text-xs text-[var(--muted)]">{match.theyHave.length} disponibles</div>
              </div>
              <div className="px-3 py-1 rounded-lg bg-[var(--lime)]/20 text-[var(--lime)] text-sm font-bold">
                {selectedRequesting.length} ✓
              </div>
            </div>

            {/* Search Input */}
            {match.theyHave.length > 10 && (
              <input
                type="text"
                value={searchRequesting}
                onChange={(e) => setSearchRequesting(e.target.value)}
                placeholder="🔍 Buscar por número o jugador..."
                className="w-full mb-2 px-3 py-2 rounded-lg bg-[var(--surface-3)] border border-[var(--border)] focus:border-[var(--lime)] outline-none text-sm"
              />
            )}

            <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto">
              {filteredRequesting.length > 0 ? (
                filteredRequesting.map((sticker) => {
                  const isSelected = selectedRequesting.some(s => s.stickerId === sticker.stickerId);
                  return (
                    <button
                      key={sticker.stickerId}
                      onClick={() => toggleRequesting(sticker)}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'bg-[var(--lime)] border-[var(--lime)] text-black scale-95'
                          : 'bg-[var(--surface-2)] border-[var(--border)] hover:border-[var(--lime)]'
                      }`}
                    >
                      <div className="font-bold text-sm">{sticker.number}</div>
                      <div className="text-xs opacity-75 truncate">{sticker.playerName}</div>
                      {isSelected && <div className="text-lg mt-1">✓</div>}
                    </button>
                  );
                })
              ) : (
                <div className="col-span-4 text-center py-4 text-[var(--muted)] text-sm">
                  No se encontraron figuritas con "{searchRequesting}"
                </div>
              )}
            </div>
          </div>

          {/* Helper text */}
          <div className="p-3 rounded-lg bg-[var(--surface-3)] border border-[var(--border)]">
            <p className="text-xs text-[var(--muted)] font-mono">
              // Seleccioná las figuritas que querés intercambiar haciendo click en cada una
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500 text-red-500 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-[var(--border)] space-y-2">
          <button
            onClick={handleSubmit}
            disabled={loading || selectedOffering.length === 0 || selectedRequesting.length === 0}
            className="w-full py-3 rounded-xl bg-[var(--lime)] text-black font-bold shadow-[3px_3px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[3px_3px_0_#000]"
          >
            {loading ? 'ENVIANDO...' : `ENVIAR PROPUESTA (${selectedOffering.length}×${selectedRequesting.length})`}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full py-2 rounded-xl bg-[var(--surface-2)] text-[var(--muted)] font-bold hover:bg-[var(--surface-3)] transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
