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
      <div className="austin-bg min-h-screen w-full flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        <footer className="py-4 px-6 text-center text-xs text-white/30">
          &copy; {new Date().getFullYear()}{' '}
          <a
            href="https://derekensign.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-[var(--verde)] transition-colors"
          >
            derekensign
          </a>
        </footer>
      </div>
    </main>
  );
}
