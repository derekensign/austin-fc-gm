'use client';

import { useSidebar } from './Sidebar';

export function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <main
      className={`flex-1 min-h-screen transition-all duration-200 ease-in-out
        pt-14 md:pt-0
        ml-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}
      `}
    >
      <div className="austin-bg min-h-screen w-full">
        {children}
      </div>
    </main>
  );
}
