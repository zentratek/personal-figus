import { useState, useEffect, useMemo } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { TopBar } from '../components/layout/TopBar';
import { NotificationButton } from '../components/common/NotificationButton';
import { UserAvatar } from '../components/common/UserAvatar';
import { NotificationPanel } from '../components/notifications/NotificationPanel';
import { StatsCard } from '../components/home/StatsCard';
import { ActionButtons } from '../components/home/ActionButtons';
import { MatchesCard } from '../components/home/MatchesCard';
import { PricingModal } from '../components/subscription/PricingModal';
import { getUserStickers } from '../services/stickerService';
import { calculateStats, TOTAL_STICKERS } from '../services/mockData';
import { subscribeToNotifications, markNotificationAsRead, deleteNotification } from '../services/notificationService';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';

export function HomeScreen() {
  const { user } = useAuth();
  const subscription = useSubscription(user?.uid);
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

  // Load user stickers from Firestore
  useEffect(() => {
    const loadStickers = async () => {
      try {
        const userStickers = await getUserStickers(user.uid);
        setStickers(userStickers);
      } catch (error) {
        console.error('Error loading stickers:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStickers();
  }, [user.uid]);

  // Subscribe to notifications
  useEffect(() => {
    const unsubscribe = subscribeToNotifications(user.uid, (notifs) => {
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [user.uid]);

  // Handle mark notification as read
  const handleMarkRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Handle delete notification
  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // Calculate stats
  const stats = useMemo(() => calculateStats(stickers), [stickers]);

  // Get first name from displayName
  const firstName = user.displayName?.split(' ')[0] || 'Usuario';

  // Format current date in Spanish
  const currentDate = useMemo(() => {
    const date = new Date();
    const formatted = date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    return formatted.toUpperCase();
  }, []);

  // Loading state
  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <svg className="animate-spin h-12 w-12 text-[var(--lime)] mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-[var(--muted)] text-lg">Cargando...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      customTopBar={
        <TopBar
          left={
            <div className="flex items-center gap-3">
              <img
                src="/fifa-2026-logo.png"
                alt="FIFA 2026"
                className="h-12 w-auto object-contain"
              />
              <div
                className="font-bungee text-2xl tracking-wide"
                style={{
                  color: 'var(--primary)',
                  textShadow: '2px 2px 0 #000',
                }}
              >
                FIGUS
              </div>
            </div>
          }
          right={
            <div className="flex items-center gap-2.5">
              <NotificationButton
                count={unreadCount}
                onClick={() => setShowNotifications(true)}
              />
              <UserAvatar user={user} />
            </div>
          }
        />
      }
    >
      <div className="px-4 py-3.5 pb-[100px] space-y-3.5">
        {/* Header Section */}
        <div>
          <p className="text-[10px] text-[var(--muted)] mb-0.5 font-mono tracking-wide uppercase">
            {currentDate}
          </p>
          <h1 className="text-xl font-bold leading-tight">
            Hola, <span className="text-[var(--primary)]">{firstName}</span>.
          </h1>
          <p className="text-base leading-tight">
            Te faltan <span className="text-[var(--lime)] font-bold">{stats.needed} figuras</span>.
          </p>
        </div>

        {/* Stats Card */}
        <StatsCard stats={stats} total={TOTAL_STICKERS} />

        {/* Pricing Promo Card */}
        {!subscription.loading && subscription.isFree && (
          <div
            onClick={() => setShowPricingModal(true)}
            className="bg-gradient-to-r from-[var(--primary)]/20 to-[var(--lime)]/20 border-2 border-[var(--primary)] rounded-xl p-4 cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">✨</span>
                  <p className="font-bold text-[var(--primary)]">Upgrade tu cuenta</p>
                </div>
                <p className="text-sm text-[var(--muted)]">
                  Escaneos ilimitados, grupos sin límite y más
                </p>
              </div>
              <button className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded-lg border-2 border-black shadow-[3px_3px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] transition-all">
                Ver Planes
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <ActionButtons />

        {/* Matches Section */}
        <div>
          <p className="text-[10px] text-[var(--muted)] font-mono mb-1.5 tracking-wide">
            // MATCHES DE HOY
          </p>
          <MatchesCard />
        </div>

        {/* Future: Group Section (Phase 8) */}
        {/* Future: Streak Section (Phase 6+) */}
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onDelete={handleDeleteNotification}
      />

      {/* Pricing Modal */}
      {showPricingModal && (
        <PricingModal onClose={() => setShowPricingModal(false)} />
      )}
    </AppLayout>
  );
}
