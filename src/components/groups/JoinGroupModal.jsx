import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getGroupByCode, joinGroup } from '../../services/groupService';
import { useNavigate } from 'react-router-dom';

/**
 * JoinGroupModal - Modal for joining an existing group with invite code
 * Format: XXXX-XXXX (auto-formats as user types)
 */
export function JoinGroupModal({ onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [groupPreview, setGroupPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  // Auto-format code with dash (XXXX-XXXX)
  const handleCodeChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Limit to 8 characters
    if (value.length > 8) {
      value = value.slice(0, 8);
    }

    // Add dash after 4 characters
    if (value.length > 4) {
      value = value.slice(0, 4) + '-' + value.slice(4);
    }

    setCode(value);
    setError('');
    setGroupPreview(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setGroupPreview(null);

    if (code.length !== 9) { // XXXX-XXXX = 9 chars
      setError('El código debe tener 8 caracteres (formato: XXXX-XXXX)');
      return;
    }

    setLoading(true);

    try {
      const group = await getGroupByCode(code);

      if (!group) {
        setError('Código inválido. Verificá que esté bien escrito.');
      } else if (!group.settings.isActive) {
        setError('Este grupo ya no está activo.');
      } else if (group.memberCount >= group.settings.maxMembers) {
        setError(`Este grupo está lleno (${group.settings.maxMembers} miembros).`);
      } else if (group.members.some(m => m.userId === user.uid)) {
        setError('Ya sos miembro de este grupo.');
      } else {
        setGroupPreview(group);
      }
    } catch (err) {
      console.error('Error searching for group:', err);
      setError('Error al buscar el grupo. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!groupPreview) return;

    setJoining(true);
    setError('');

    try {
      await joinGroup(
        user.uid,
        user.displayName,
        user.photoURL,
        code
      );

      // Success - navigate to group screen
      navigate('/grupo');
      onClose();
    } catch (err) {
      console.error('Error joining group:', err);
      setError(err.message || 'Error al unirte al grupo. Intenta de nuevo.');
    } finally {
      setJoining(false);
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
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-[var(--surface)] w-full max-w-md rounded-2xl border-2 border-[var(--border)] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-4 border-b-2 border-[var(--border)] flex justify-between items-center bg-[var(--surface-2)]">
          <h3 className="text-xl font-bold">Unirme a un Grupo</h3>
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Code Input Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">
                Código de Invitación <span className="text-[var(--primary)]">*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                placeholder="XXXX-XXXX"
                className="w-full px-4 py-3 bg-[var(--surface-2)] border-2 border-[var(--border)] rounded-lg focus:border-[var(--cyan)] focus:outline-none transition-colors text-center font-mono text-2xl tracking-wider"
                autoFocus
              />
              <p className="text-xs text-[var(--muted)] mt-2 text-center">
                Formato: 4 caracteres - 4 caracteres
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 9}
              className="w-full h-12 bg-[var(--cyan)] text-black font-bold rounded-xl border-2 border-black shadow-[3px_3px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Buscando...' : 'Buscar Grupo'}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-[var(--red)]/20 border-2 border-[var(--red)] rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Group Preview */}
          {groupPreview && (
            <div className="space-y-4 animate-slide-up">
              {/* Group Card */}
              <div className="p-6 bg-[var(--surface-2)] border-2 border-[var(--cyan)] rounded-xl">
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{groupPreview.emoji}</div>
                  <h3 className="text-2xl font-bold mb-1">{groupPreview.name}</h3>
                  <p className="text-sm text-[var(--muted)]">
                    {groupPreview.memberCount} {groupPreview.memberCount === 1 ? 'miembro' : 'miembros'}
                  </p>
                </div>

                {/* Stats */}
                {groupPreview.stats && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-[var(--surface)] rounded-lg">
                      <div className="text-2xl font-bold text-[var(--lime)]">
                        {groupPreview.stats.averageCompletion}%
                      </div>
                      <div className="text-xs text-[var(--muted)]">Completado</div>
                    </div>
                    <div className="text-center p-3 bg-[var(--surface)] rounded-lg">
                      <div className="text-2xl font-bold text-[var(--cyan)]">
                        {groupPreview.stats.totalOwned}
                      </div>
                      <div className="text-xs text-[var(--muted)]">Figuritas</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Join Button */}
              <button
                onClick={handleJoin}
                disabled={joining}
                className="w-full h-12 bg-[var(--lime)] text-black font-bold rounded-xl border-2 border-black shadow-[3px_3px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {joining ? 'Uniéndome...' : `Unirme a ${groupPreview.name}`}
              </button>
            </div>
          )}

          {/* Help Text */}
          {!groupPreview && !error && (
            <div className="text-center text-sm text-[var(--muted)]">
              <p>Pedile el código de invitación a un amigo</p>
              <p>que ya esté en el grupo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
