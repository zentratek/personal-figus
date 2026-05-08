import { useState } from 'react';
import { updateStickerStatus } from '../../services/stickerService';
import { useAuth } from '../../contexts/AuthContext';

/**
 * StickerModal - Full-screen modal for editing a sticker
 * Allows changing status (needed/owned/repeated) and count
 */
export function StickerModal({ sticker, onClose, onUpdate }) {
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState(sticker.status);
  const [count, setCount] = useState(sticker.count || 2);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateStickerStatus(
        user.uid,
        sticker.stickerId,
        selectedStatus,
        count
      );

      // Update local state
      onUpdate({
        ...sticker,
        status: selectedStatus,
        count: selectedStatus === 'repeated' ? count : selectedStatus === 'owned' ? 1 : 0
      });

      onClose();
    } catch (error) {
      console.error('Error updating sticker:', error);
      alert('Error al guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-0 sm:p-4 pb-16 sm:pb-4"
      onClick={handleBackdropClick}
    >
      {/* Modal content */}
      <div className="bg-[var(--surface)] w-full max-w-md rounded-t-3xl sm:rounded-3xl border-2 border-[var(--border)] overflow-hidden animate-slide-up max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b-2 border-[var(--border)] flex justify-between items-center bg-[var(--surface-2)]">
          <div>
            <h3 className="text-xl font-bold">Figurita #{sticker.number}</h3>
            <p className="text-sm text-[var(--muted)]">{sticker.stickerId}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-[var(--surface-3)] hover:bg-[var(--border)] flex items-center justify-center transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sticker preview */}
        <div
          className="p-8 text-center"
          style={{
            background: `linear-gradient(135deg, ${sticker.color1}33 0%, ${sticker.color2}33 100%)`
          }}
        >
          <span
            className={`fi fi-${sticker.flagCode} text-7xl mb-4 inline-block`}
            style={{
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
            }}
          />
          <h2 className="text-2xl font-bold mb-1">{sticker.playerName}</h2>
          <p className="text-[var(--muted)] text-lg">{sticker.teamName}</p>
          {sticker.position !== 'BADGE' && sticker.position !== 'GROUP' && (
            <span className="inline-block mt-2 px-3 py-1 bg-[var(--surface)] rounded-lg text-sm font-bold border border-[var(--border)]">
              {sticker.position}
            </span>
          )}
        </div>

        {/* Status tabs */}
        <div className="p-6">
          <label className="block text-sm font-bold mb-3 text-[var(--muted)]">
            Estado de la figurita
          </label>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { id: 'needed', label: 'Necesito', icon: '❓', color: 'var(--muted)' },
              { id: 'owned', label: 'Tengo', icon: '✓', color: 'var(--cyan)' },
              { id: 'repeated', label: 'Repetida', icon: '×', color: 'var(--lime)' }
            ].map(status => (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={`
                  py-4 rounded-xl font-bold text-sm transition-all relative
                  ${selectedStatus === status.id
                    ? 'bg-[var(--lime)] text-black shadow-[4px_4px_0_#000] scale-105'
                    : 'bg-[var(--surface-2)] text-[var(--muted)] hover:bg-[var(--surface-3)] border-2 border-[var(--border)]'
                  }
                `}
              >
                <div className="text-2xl mb-1">{status.icon}</div>
                {status.label}
              </button>
            ))}
          </div>

          {/* Counter for repeated */}
          {selectedStatus === 'repeated' && (
            <div className="mb-6 p-6 bg-[var(--surface-2)] rounded-xl border-2 border-[var(--border)]">
              <label className="block text-sm font-bold mb-3 text-[var(--muted)] text-center">
                ¿Cuántas repetidas tenés?
              </label>
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => setCount(Math.max(2, count - 1))}
                  className="w-12 h-12 rounded-xl bg-[var(--surface-3)] hover:bg-[var(--border)] font-bold text-2xl border-2 border-[var(--border)] transition-colors"
                  aria-label="Decrementar"
                >
                  −
                </button>
                <div className="text-5xl font-bold text-[var(--lime)] min-w-[80px] text-center">
                  ×{count}
                </div>
                <button
                  onClick={() => setCount(count + 1)}
                  className="w-12 h-12 rounded-xl bg-[var(--surface-3)] hover:bg-[var(--border)] font-bold text-2xl border-2 border-[var(--border)] transition-colors"
                  aria-label="Incrementar"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full h-14 bg-[var(--lime)] text-black font-bold rounded-xl border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Guardando...
              </span>
            ) : (
              'Guardar Cambios'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
