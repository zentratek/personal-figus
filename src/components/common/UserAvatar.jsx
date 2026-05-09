/**
 * UserAvatar - Display user's avatar or initials
 * Shows profile picture from Google auth or first letter of name
 */
export function UserAvatar({ user, size = 40 }) {
  const initial = user?.displayName?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div
      className="rounded-[10px] border-2 border-black flex items-center justify-center shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        background: user?.photoURL ? 'transparent' : 'var(--cyan)',
        color: '#0A0A14',
      }}
    >
      {user?.photoURL ? (
        <img
          src={user.photoURL}
          alt={user.displayName || 'User'}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="font-mono font-bold" style={{ fontSize: size * 0.4 }}>
          {initial}
        </span>
      )}
    </div>
  );
}
