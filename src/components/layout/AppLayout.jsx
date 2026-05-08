import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';

export function AppLayout({ title, actions, children }) {
  return (
    <div className="min-h-screen pb-16">
      {/* TopBar */}
      <TopBar title={title} actions={actions} />

      {/* Main Content */}
      <main className="max-w-screen-lg mx-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
