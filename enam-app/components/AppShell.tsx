'use client';

import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import ProtectedRoute from './ProtectedRoute';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen" style={{ background: 'var(--bg-canvas)' }}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">{children}</main>
          <BottomNav />
        </div>
      </div>
    </ProtectedRoute>
  );
}
