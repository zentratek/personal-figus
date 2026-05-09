import { Bell } from 'lucide-react';

/**
 * NotificationButton - Button with notification badge
 * Shows count of unread notifications
 */
export function NotificationButton({ count = 0, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative w-10 h-10 bg-[var(--surface)] border-2 border-[var(--border)] rounded-[10px] flex items-center justify-center hover:bg-[var(--surface-2)] transition-colors"
    >
      <Bell className="w-[18px] h-[18px] text-[var(--text)]" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--red)] text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0A0A14]">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}
