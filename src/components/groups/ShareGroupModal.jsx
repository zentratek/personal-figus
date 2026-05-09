import { X, Copy, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * ShareGroupModal - Modal for sharing group code via social media
 * Supports WhatsApp, Instagram, TikTok, and generic sharing
 */
export function ShareGroupModal({ group, onClose }) {
  if (!group) return null;

  const shareUrl = `https://figus.online/join/${group.code}`;
  const shareText = `¡Unite a mi grupo de Figus "${group.name}"! 🏆\n\nCódigo: ${group.code}\nÓ entrá directo: ${shareUrl}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(group.code);
    toast.success('¡Código copiado!');
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareViaInstagram = () => {
    // Instagram no permite deep links directos, copiamos al portapapeles
    navigator.clipboard.writeText(shareText);
    toast.success('Texto copiado! Pegalo en tu historia de Instagram', {
      duration: 4000,
    });
  };

  const shareViaTikTok = () => {
    // TikTok tampoco permite deep links, copiamos al portapapeles
    navigator.clipboard.writeText(shareText);
    toast.success('Texto copiado! Pegalo en tu video de TikTok', {
      duration: 4000,
    });
  };

  const shareViaNavigator = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Grupo de Figus: ${group.name}`,
          text: shareText,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-t-[20px] sm:rounded-[20px] w-full sm:max-w-md shadow-[0_-4px_0_#000] sm:shadow-[4px_4px_0_#000] p-6 animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Compartir Grupo</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[var(--surface-2)] border-2 border-[var(--border)] flex items-center justify-center hover:bg-[var(--surface-3)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Group Info */}
          <div className="p-3.5 bg-[var(--surface-2)] border-2 border-[var(--border)] rounded-[12px] mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">{group.emoji}</div>
              <div>
                <p className="font-bold">{group.name}</p>
                <p className="text-xs text-[var(--muted)] font-mono">
                  {group.memberCount} {group.memberCount === 1 ? 'miembro' : 'miembros'}
                </p>
              </div>
            </div>
            <div className="p-2.5 bg-[var(--surface)] rounded-lg border-2 border-[var(--border)] text-center">
              <p className="text-[9px] text-[var(--muted)] font-mono mb-1">CÓDIGO</p>
              <p className="text-lg font-bold text-[var(--lime)] font-mono tracking-wider">
                {group.code}
              </p>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={shareViaWhatsApp}
              className="w-full flex items-center gap-3 p-3.5 bg-[#25D366] text-white border-2 border-black rounded-[12px] shadow-[3px_3px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] transition-all font-semibold"
            >
              <span className="text-2xl">💬</span>
              <span className="flex-1 text-left">Compartir por WhatsApp</span>
            </button>

            <button
              onClick={shareViaInstagram}
              className="w-full flex items-center gap-3 p-3.5 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white border-2 border-black rounded-[12px] shadow-[3px_3px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] transition-all font-semibold"
            >
              <span className="text-2xl">📸</span>
              <span className="flex-1 text-left">Compartir en Instagram</span>
            </button>

            <button
              onClick={shareViaTikTok}
              className="w-full flex items-center gap-3 p-3.5 bg-[#000000] text-white border-2 border-[var(--cyan)] rounded-[12px] shadow-[3px_3px_0_var(--cyan)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_var(--cyan)] transition-all font-semibold"
            >
              <span className="text-2xl">🎵</span>
              <span className="flex-1 text-left">Compartir en TikTok</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[var(--surface)] px-2 text-[var(--muted)] font-mono">O</span>
              </div>
            </div>

            <button
              onClick={copyToClipboard}
              className="w-full flex items-center gap-3 p-3.5 bg-[var(--surface-2)] text-[var(--text)] border-2 border-[var(--border)] rounded-[12px] shadow-[3px_3px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] transition-all font-semibold"
            >
              <Copy className="w-5 h-5" />
              <span className="flex-1 text-left">Copiar código</span>
            </button>

            {navigator.share && (
              <button
                onClick={shareViaNavigator}
                className="w-full flex items-center gap-3 p-3.5 bg-[var(--surface-2)] text-[var(--text)] border-2 border-[var(--border)] rounded-[12px] shadow-[3px_3px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] transition-all font-semibold"
              >
                <Share2 className="w-5 h-5" />
                <span className="flex-1 text-left">Más opciones...</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
