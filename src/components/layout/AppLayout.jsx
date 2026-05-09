import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';

/**
 * AppLayout - Main layout wrapper with TopBar and BottomNav
 * Supports custom TopBar via customTopBar prop or legacy title/actions
 */
export function AppLayout({ title, actions, customTopBar, children }) {
  return (
    <div className="min-h-screen pb-16">
      {/* TopBar - custom or default */}
      {customTopBar || <TopBar title={title} actions={actions} />}

      {/* Main Content */}
      <main className="max-w-screen-lg mx-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
