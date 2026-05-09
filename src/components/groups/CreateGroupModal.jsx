import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { createGroup } from '../../services/groupService';
import { useNavigate } from 'react-router-dom';

/**
 * CreateGroupModal - Modal for creating a new group
 * Generates a unique invite code and creates the group
 */
export function CreateGroupModal({ onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [emoji, setEmoji] = useState('🏆');
  const [maxMembers, setMaxMembers] = useState(20);
  const [creating, setCreating] = useState(false);
  const [createdGroup, setCreatedGroup] = useState(null);
  const [error, setError] = useState('');

  const emojis = ['🏆', '⚽', '🎯', '🔥', '💎', '⭐', '🎮', '🍕'];

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');

    if (!groupName.trim()) {
      setError('El nombre del grupo es requerido');
      return;
    }

    if (groupName.length > 30) {
      setError('El nombre no puede tener más de 30 caracteres');
      return;
    }

    setCreating(true);

    try {
      const group = await createGroup(
        user.uid,
        user.displayName,
        user.photoURL,
        {
          name: groupName.trim(),
          emoji,
          maxMembers
        }
      );

      setCreatedGroup(group);
    } catch (err) {
      console.error('Error creating group:', err);
      setError('Error al crear el grupo. Intenta de nuevo.');
    } finally {
      setCreating(false);
    }
  };

  const copyCode = () => {
    if (createdGroup) {
      navigator.clipboard.writeText(createdGroup.code);
      toast.success('¡Código copiado al portapapeles!');
    }
  };

  const shareCode = async () => {
    if (!createdGroup) return;

    const text = `¡Unite a mi grupo de Figus "${createdGroup.name}"! Código: ${createdGroup.code}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Código de Grupo', text });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      copyCode();
    }
  };

  const handleDone = () => {
    navigate('/grupo');
    onClose();
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !createdGroup) {
      onClose();
    }
  };

  // Success screen (after group created)
  if (createdGroup) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-[var(--surface)] w-full max-w-md rounded-2xl border-2 border-[var(--lime)] overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="p-6 text-center bg-gradient-to-b from-[var(--lime)]/20 to-transparent">
            <div className="text-6xl mb-4">{createdGroup.emoji}</div>
            <h2 className="text-2xl font-bold mb-2">¡Grupo Creado!</h2>
            <p className="text-[var(--muted)]">{createdGroup.name}</p>
          </div>

          {/* Code Display */}
          <div className="p-6">
            <p className="text-sm text-[var(--muted)] mb-3 text-center">
              Compartí este código con tus amigos:
            </p>

            <div className="bg-[var(--surface-3)] rounded-xl p-4 mb-4 border-2 border-[var(--border)]">
              <div className="text-3xl font-bold text-[var(--lime)] text-center font-mono tracking-wider">
                {createdGroup.code}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={copyCode}
                className="px-4 py-3 bg-[var(--surface-2)] border-2 border-[var(--border)] rounded-lg font-bold hover:bg-[var(--surface-3)] transition-colors"
              >
                📋 Copiar
              </button>
              <button
                onClick={shareCode}
                className="px-4 py-3 bg-[var(--cyan)] text-black border-2 border-black rounded-lg font-bold hover:translate-y-[-2px] transition-transform"
              >
                📤 Compartir
              </button>
            </div>

            <button
              onClick={handleDone}
              className="w-full h-12 bg-[var(--lime)] text-black font-bold rounded-xl border-2 border-black shadow-[3px_3px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] transition-all"
            >
              Ver Mi Grupo →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Create form
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-[var(--surface)] w-full max-w-md rounded-2xl border-2 border-[var(--border)] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-4 border-b-2 border-[var(--border)] flex justify-between items-center bg-[var(--surface-2)]">
          <h3 className="text-xl font-bold">Crear Grupo Nuevo</h3>
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

        {/* Form */}
        <form onSubmit={handleCreate} className="p-6 space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-bold mb-2">
              Nombre del Grupo <span className="text-[var(--primary)]">*</span>
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder='Ej: "Los Pibes", "Familia García"'
              maxLength={30}
              className="w-full px-4 py-3 bg-[var(--surface-2)] border-2 border-[var(--border)] rounded-lg focus:border-[var(--lime)] focus:outline-none transition-colors"
              autoFocus
            />
            <p className="text-xs text-[var(--muted)] mt-1">
              {groupName.length}/30 caracteres
            </p>
          </div>

          {/* Emoji Picker */}
          <div>
            <label className="block text-sm font-bold mb-2">
              Emoji del Grupo
            </label>
            <div className="flex gap-2 flex-wrap">
              {emojis.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`
                    w-12 h-12 text-2xl rounded-lg border-2 transition-all
                    ${emoji === e
                      ? 'bg-[var(--lime)] border-black scale-110'
                      : 'bg-[var(--surface-2)] border-[var(--border)] hover:scale-105'
                    }
                  `}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Max Members */}
          <div>
            <label className="block text-sm font-bold mb-2">
              Máximo de Miembros
            </label>
            <input
              type="number"
              value={maxMembers}
              onChange={(e) => setMaxMembers(parseInt(e.target.value) || 20)}
              min={2}
              max={50}
              className="w-full px-4 py-3 bg-[var(--surface-2)] border-2 border-[var(--border)] rounded-lg focus:border-[var(--lime)] focus:outline-none transition-colors"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-[var(--red)]/20 border-2 border-[var(--red)] rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={creating || !groupName.trim()}
            className="w-full h-12 bg-[var(--lime)] text-black font-bold rounded-xl border-2 border-black shadow-[3px_3px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? 'Creando...' : 'Crear Grupo'}
          </button>
        </form>
      </div>
    </div>
  );
}
