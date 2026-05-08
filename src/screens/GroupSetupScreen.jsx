import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { CreateGroupModal } from '../components/groups/CreateGroupModal';
import { JoinGroupModal } from '../components/groups/JoinGroupModal';

/**
 * GroupSetupScreen - First-time user flow for creating or joining a group
 * Shown when user doesn't have a group yet
 */
export function GroupSetupScreen() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl font-bold mb-2">
            CREÁ TU GRUPO
          </h1>
          <p className="text-lg text-[var(--muted)]">
            o unite a uno existente
          </p>
        </div>

        {/* Actions */}
        <div className="w-full max-w-md space-y-4 mb-8">
          {/* Create Group Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full p-6 rounded-xl bg-[var(--surface-2)] border-2 border-[var(--border)] hover:border-[var(--lime)] hover:bg-[var(--surface-3)] transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--lime)] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="text-left flex-1">
              <div className="text-lg font-bold mb-1">CREAR GRUPO NUEVO</div>
              <div className="text-sm text-[var(--muted)]">Iniciá tu propio grupo de intercambio</div>
            </div>
          </button>

          {/* Join Group Button */}
          <button
            onClick={() => setShowJoinModal(true)}
            className="w-full p-6 rounded-xl bg-[var(--surface-2)] border-2 border-[var(--border)] hover:border-[var(--cyan)] hover:bg-[var(--surface-3)] transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--cyan)] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div className="text-left flex-1">
              <div className="text-lg font-bold mb-1">UNIRME CON CÓDIGO</div>
              <div className="text-sm text-[var(--muted)]">Tenés un código de invitación</div>
            </div>
          </button>
        </div>

        {/* Info Section */}
        <div className="w-full max-w-md p-6 rounded-xl bg-[var(--surface)] border-2 border-[var(--border)]">
          <h3 className="text-sm font-bold mb-3 text-[var(--muted)]">
            ¿Para qué sirve un grupo?
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[var(--lime)]">•</span>
              <span>Intercambiar figuritas con tus amigos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--cyan)]">•</span>
              <span>Ver el progreso de cada miembro</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)]">•</span>
              <span>Coordinar encuentros para cambiar</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--gold)]">•</span>
              <span>Competir sanamente por completar el álbum</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateGroupModal onClose={() => setShowCreateModal(false)} />
      )}

      {showJoinModal && (
        <JoinGroupModal onClose={() => setShowJoinModal(false)} />
      )}
    </AppLayout>
  );
}
