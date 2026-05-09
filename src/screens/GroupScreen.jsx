import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../contexts/AuthContext';
import { getUserGroup, leaveGroup } from '../services/groupService';
import { getUserProfile } from '../services/userService';

/**
 * GroupScreen - Main screen for viewing group members and stats
 * Shows group info, members list, and group actions
 */
export function GroupScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  useEffect(() => {
    loadGroup();
  }, [user.uid]);

  const loadGroup = async () => {
    try {
      const [groupData, profile] = await Promise.all([
        getUserGroup(user.uid),
        getUserProfile(user.uid)
      ]);

      if (!groupData) {
        // User has no group - redirect to setup
        navigate('/grupo/setup');
        return;
      }

      setGroup(groupData);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading group:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (group) {
      navigator.clipboard.writeText(group.code);
      toast.success('¡Código copiado al portapapeles!');
    }
  };

  const shareCode = async () => {
    if (!group) return;

    const text = `¡Unite a mi grupo de Figus "${group.name}"! Código: ${group.code}`;

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

  const handleLeaveGroup = async () => {
    if (!group) return;

    try {
      await leaveGroup(user.uid, group.id);
      toast.success('Saliste del grupo exitosamente');
      navigate('/grupo/setup');
    } catch (error) {
      console.error('Error leaving group:', error);
      toast.error('Error al salir del grupo. Intenta de nuevo.');
    }
  };

  const isAdmin = group?.members.find(m => m.userId === user.uid)?.role === 'admin';

  // Loading state
  if (loading) {
    return (
      <AppLayout title="GRUPO">
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <svg className="animate-spin h-12 w-12 text-[var(--lime)] mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-[var(--muted)] text-lg">Cargando grupo...</p>
        </div>
      </AppLayout>
    );
  }

  if (!group) {
    return null; // Will redirect to setup
  }

  return (
    <AppLayout title="GRUPO">
      <div className="px-4 py-3.5 pb-[100px] space-y-3.5">
        {/* Group Header */}
        <div className="p-4 rounded-[14px] bg-[var(--surface-2)] border-2 border-[var(--border)] shadow-[4px_4px_0_#000]">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-4xl">{group.emoji}</div>
            <div className="flex-1">
              <h1 className="text-xl font-bold mb-0.5">{group.name}</h1>
              <p className="text-xs text-[var(--muted)] font-mono">
                {group.memberCount} {group.memberCount === 1 ? 'miembro' : 'miembros'}
              </p>
            </div>
          </div>

          {/* Group Code */}
          <div className="p-3 bg-[var(--surface)] rounded-[10px] border-2 border-[var(--border)] mb-3">
            <p className="text-[9px] text-[var(--muted)] mb-1.5 text-center font-mono uppercase">Código del Grupo</p>
            <div className="text-xl font-bold text-[var(--lime)] text-center font-mono tracking-wider">
              {group.code}
            </div>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={copyCode}
              className="px-3 py-2.5 bg-[var(--surface-3)] border-2 border-[var(--border)] rounded-[10px] text-sm font-bold hover:bg-[var(--border)] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>📋</span> Copiar
            </button>
            <button
              onClick={shareCode}
              className="px-3 py-2.5 bg-[var(--cyan)] text-black border-2 border-black rounded-[10px] text-sm font-bold shadow-[3px_3px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] transition-all flex items-center justify-center gap-1.5"
            >
              <span>📤</span> Invitar
            </button>
          </div>
        </div>

        {/* Group Stats */}
        <div className="p-4 rounded-[14px] bg-[var(--surface-2)] border-2 border-[var(--border)] shadow-[4px_4px_0_#000]">
          <h3 className="text-[10px] font-bold mb-3 text-[var(--muted)] font-mono tracking-wide">ESTADÍSTICAS DEL GRUPO</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--lime)] mb-0.5">
                {group.stats.averageCompletion}%
              </div>
              <div className="text-[9px] text-[var(--muted)] font-mono">Promedio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--cyan)] mb-0.5">
                {group.stats.totalOwned}
              </div>
              <div className="text-[9px] text-[var(--muted)] font-mono">Tenemos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--muted)] mb-0.5">
                {group.stats.totalNeeded}
              </div>
              <div className="text-[9px] text-[var(--muted)] font-mono">Faltan</div>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-[10px] font-bold text-[var(--muted)] font-mono tracking-wide">
              MIEMBROS ({group.memberCount})
            </h3>
          </div>

          <div className="space-y-2.5">
            {group.members
              .sort((a, b) => {
                // Admin first
                if (a.role === 'admin') return -1;
                if (b.role === 'admin') return 1;
                // Then by join date
                return a.joinedAt.seconds - b.joinedAt.seconds;
              })
              .map((member) => (
                <div
                  key={member.userId}
                  className="p-3 rounded-[14px] bg-[var(--surface-2)] border-2 border-[var(--border)] shadow-[4px_4px_0_#000] flex items-center gap-3"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[var(--surface-3)] overflow-hidden flex-shrink-0 border-2 border-[var(--border)]">
                    {member.photoURL ? (
                      <img
                        src={member.photoURL}
                        alt={member.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg font-bold">
                        {member.displayName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm">{member.displayName}</span>
                      {member.role === 'admin' && (
                        <span className="px-1.5 py-0.5 bg-[var(--gold)] text-black text-[9px] font-bold rounded border border-black">
                          ADMIN
                        </span>
                      )}
                      {member.userId === user.uid && (
                        <span className="text-[var(--muted)] text-xs">(Vos)</span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--muted)] font-mono">
                      Miembro desde {new Date(member.joinedAt.seconds * 1000).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Leave Group Button */}
        <div className="pt-2">
          <button
            onClick={() => setShowLeaveConfirm(true)}
            className="w-full px-4 py-2.5 bg-[var(--surface-2)] border-2 border-[var(--red)] text-[var(--red)] rounded-[10px] text-sm font-bold hover:bg-[var(--red)]/20 transition-colors"
          >
            Salir del Grupo
          </button>
        </div>
      </div>

      {/* Leave Confirmation Modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] w-full max-w-md rounded-2xl border-2 border-[var(--red)] p-6">
            <h3 className="text-xl font-bold mb-4">¿Salir del grupo?</h3>
            <p className="text-[var(--muted)] mb-6">
              {isAdmin
                ? 'Sos el admin. Si salís, el rol de admin se transferirá al miembro más antiguo.'
                : '¿Estás seguro que querés salir de este grupo?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="flex-1 px-4 py-3 bg-[var(--surface-2)] border-2 border-[var(--border)] rounded-lg font-bold hover:bg-[var(--surface-3)] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLeaveGroup}
                className="flex-1 px-4 py-3 bg-[var(--red)] text-white border-2 border-black rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
