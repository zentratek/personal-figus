import { useState, useEffect, useMemo } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { TopBar } from '../components/layout/TopBar';
import { NotificationButton } from '../components/common/NotificationButton';
import { UserAvatar } from '../components/common/UserAvatar';
import { StatsCard } from '../components/home/StatsCard';
import { ActionButtons } from '../components/home/ActionButtons';
import { MatchesCard } from '../components/home/MatchesCard';
import { getUserStickers } from '../services/stickerService';
import { calculateStats } from '../services/mockData';
import { useAuth } from '../contexts/AuthContext';

export function HomeScreen() {
  const { user } = useAuth();
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(true);

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
              <NotificationButton count={0} onClick={() => {/* TODO: Open notifications */}} />
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
        <StatsCard stats={stats} total={stickers.length} />

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
    </AppLayout>
  );
}
