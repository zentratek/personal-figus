import { X, Bell, UserPlus, ArrowLeftRight, CheckCircle, XCircle, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * NotificationPanel - Side panel for displaying notifications
 * Shows list of notifications with real-time updates
 */
export function NotificationPanel({ isOpen, onClose, notifications, onMarkRead }) {
  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'trade_received': return <ArrowLeftRight className="w-5 h-5" />;
      case 'trade_accepted': return <CheckCircle className="w-5 h-5" />;
      case 'trade_rejected': return <XCircle className="w-5 h-5" />;
      case 'trade_cancelled': return <XCircle className="w-5 h-5" />;
      case 'group_invite': return <UserPlus className="w-5 h-5" />;
      case 'match_found': return <Users className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'trade_received': return 'var(--cyan)';
      case 'trade_accepted': return 'var(--lime)';
      case 'trade_rejected': return 'var(--red)';
      case 'trade_cancelled': return 'var(--muted)';
      case 'group_invite': return 'var(--gold)';
      case 'match_found': return 'var(--primary)';
      default: return 'var(--muted)';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-[90%] max-w-sm bg-[var(--bg)] border-l-2 border-[var(--border)] z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[var(--surface)] border-b-2 border-[var(--border)] p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Notificaciones</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[var(--surface-2)] border-2 border-[var(--border)] flex items-center justify-center hover:bg-[var(--surface-3)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🔔</div>
              <p className="text-[var(--muted)] font-mono text-sm">
                // sin notificaciones
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-[12px] border-2 cursor-pointer transition-all ${
                  notif.read
                    ? 'bg-[var(--surface)] border-[var(--border)]'
                    : 'bg-[var(--surface-2)] border-[var(--primary)]'
                }`}
                onClick={() => !notif.read && onMarkRead(notif.id)}
              >
                <div className="flex gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center border-2 border-black shrink-0"
                    style={{ background: getColor(notif.type), color: '#0A0A14' }}
                  >
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold mb-0.5">{notif.title}</p>
                    <p className="text-xs text-[var(--muted)] line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-[var(--muted)] font-mono mt-1.5">
                      {formatDistanceToNow(new Date(notif.timestamp), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-[var(--primary)] shrink-0 mt-1" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
