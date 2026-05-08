import { memo } from 'react';

/**
 * StickerCard - Individual sticker card component
 * Shows different visual states: needed (empty), owned, repeated
 * Uses flag-icons for country flags
 */
export const StickerCard = memo(function StickerCard({ sticker, onClick }) {
  const isOwned = sticker.status === 'owned' || sticker.status === 'repeated';
  const isNeeded = sticker.status === 'needed';

  return (
    <button
      onClick={() => onClick?.(sticker)}
      className={`
        relative aspect-[2/3] rounded-lg border-2 overflow-hidden
        transition-all duration-200
        ${isOwned
          ? 'bg-gradient-to-br border-[var(--border)] shadow-[2px_2px_0_#000] hover:shadow-[3px_3px_0_#000] hover:-translate-y-0.5'
          : 'bg-[var(--surface)] border-dashed border-[var(--muted)] hover:border-[var(--border)]'
        }
        active:scale-95
      `}
      style={isOwned ? {
        background: `linear-gradient(135deg, ${sticker.color1}dd 0%, ${sticker.color2}dd 100%)`
      } : {}}
      aria-label={`Sticker ${sticker.number}: ${sticker.playerName}`}
    >
      {/* Header: Number & Badge */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-1">
        {/* Número */}
        <div className={`
          text-[10px] font-mono font-bold px-1.5 py-0.5 rounded
          ${isOwned ? 'bg-black/30 text-white' : 'bg-[var(--surface-2)] text-[var(--muted)]'}
        `}>
          #{sticker.number}
        </div>

        {/* Badge especial (escudo) */}
        {sticker.isSpecial && isOwned && (
          <div
            className="w-3 h-3 rounded-full bg-[var(--gold)] border border-black/20"
            title="Escudo especial"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center h-full p-2 pt-6">
        {isOwned ? (
          <>
            {/* Bandera del equipo */}
            <div className="mb-2">
              <span
                className={`fi fi-${sticker.flagCode} text-3xl`}
                style={{
                  fontSize: '2rem',
                  lineHeight: 1,
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                }}
              />
            </div>

            {/* Nombre del jugador */}
            <p className={`
              text-[10px] font-bold text-center line-clamp-2 mb-0.5
              ${sticker.position === 'BADGE' || sticker.position === 'GROUP' ? 'text-xs' : ''}
            `}
              style={{
                color: '#000',
                textShadow: '0 1px 2px rgba(255,255,255,0.3)'
              }}
            >
              {sticker.playerName}
            </p>

            {/* Posición */}
            {sticker.position !== 'BADGE' && sticker.position !== 'GROUP' && (
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-black/20 text-white">
                {sticker.position}
              </span>
            )}
          </>
        ) : (
          // Estado "needed" - silueta vacía
          <>
            <div className="text-5xl opacity-10 select-none">
              ?
            </div>
            <p className="text-[9px] text-[var(--muted)] mt-2">
              Necesito
            </p>
          </>
        )}
      </div>

      {/* Badge de repetidas */}
      {sticker.status === 'repeated' && sticker.count > 1 && (
        <div className="absolute bottom-1 right-1 bg-[var(--lime)] text-black text-[10px] font-bold px-1.5 py-0.5 rounded border border-black shadow-[1px_1px_0_#000]">
          ×{sticker.count}
        </div>
      )}

      {/* Team code badge (bottom left) */}
      {isOwned && (
        <div className="absolute bottom-1 left-1 text-[8px] font-mono font-bold px-1 py-0.5 rounded bg-black/30 text-white">
          {sticker.team}
        </div>
      )}
    </button>
  );
});
