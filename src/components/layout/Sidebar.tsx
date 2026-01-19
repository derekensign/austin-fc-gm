'use client';

import { useState, createContext, useContext, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  // TrendingUp, // Hidden per user request
  // FileText, // Replaced by Calculator
  Calculator,
  Settings,
  Search,
  // DollarSign, // Hidden per user request
  // BarChart3, // Hidden per user request
  Shield,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ArrowLeftRight,
  Globe,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Roster', href: '/roster', icon: Users },
  // { name: 'Player Stats', href: '/stats', icon: BarChart3 }, // Hidden per user request
  // { name: 'Valuations', href: '/valuations', icon: DollarSign }, // Hidden per user request
  // { name: 'Salary Cap', href: '/salary-cap', icon: TrendingUp }, // Hidden per user request
  { name: 'GAM/TAM Transactions', href: '/transactions', icon: ArrowLeftRight },
  { name: 'Transfer Calculator', href: '/rules', icon: Calculator },
  { name: 'Transfer Sources', href: '/transfer-sources', icon: Globe },
];

const secondaryNav = [
  { name: 'Trade Analyzer', href: '/trade', icon: Shield },
  { name: 'Settings', href: '/settings', icon: Settings },
];

// Context for sidebar state
export const SidebarContext = createContext<{
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (value: boolean) => void;
}>({
  isCollapsed: false,
  setIsCollapsed: () => {},
  isMobileOpen: false,
  setIsMobileOpen: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, setIsMobileOpen]);

  const sidebarContent = (showFull: boolean) => (
    <div className="flex h-full flex-col">
      {/* Logo & Collapse/Close Button */}
      <div className="flex h-16 items-center justify-between border-b border-[var(--obsidian-lighter)] px-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[var(--verde)] to-[var(--verde-dark)] flex items-center justify-center">
              <span className="font-display text-xl text-black font-bold">A</span>
            </div>
            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-[var(--verde)] border-2 border-[var(--obsidian)]" />
          </div>
          {showFull && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="font-display text-lg tracking-wide text-white">VERDE MANAGER</h1>
              <p className="text-xs text-white/50">Austin FC</p>
            </div>
          )}
        </div>
        {/* Show X on mobile drawer, chevron on desktop */}
        <button
          onClick={() => isMobileOpen ? setIsMobileOpen(false) : setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-[var(--obsidian-lighter)] text-white/60 hover:text-white transition-colors"
        >
          {isMobileOpen ? (
            <X className="h-5 w-5" />
          ) : isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Search - only when expanded */}
      {showFull && (
        <div className="p-3 overflow-hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:border-[var(--verde)] focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-2 overflow-y-auto">
        {showFull && (
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">
            Main
          </p>
        )}
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-[var(--verde)]/10 text-[var(--verde)] border-l-3 border-[var(--verde)]'
                  : 'text-white/70 hover:bg-[var(--obsidian-lighter)] hover:text-white'
              } ${!showFull ? 'justify-center' : ''}`}
              title={!showFull ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {showFull && <span className="font-medium text-sm">{item.name}</span>}
              {isActive && showFull && (
                <div className="ml-auto h-2 w-2 rounded-full bg-[var(--verde)]" />
              )}
            </Link>
          );
        })}

        <div className="my-3 border-t border-[var(--obsidian-lighter)]" />

        {showFull && (
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">
            Tools
          </p>
        )}
        {secondaryNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-[var(--verde)]/10 text-[var(--verde)]'
                  : 'text-white/70 hover:bg-[var(--obsidian-lighter)] hover:text-white'
              } ${!showFull ? 'justify-center' : ''}`}
              title={!showFull ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {showFull && <span className="font-medium text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Season Info Card - only when expanded */}
      {showFull && (
        <div className="mx-2 mb-3 overflow-hidden">
          <div className="rounded-xl bg-gradient-to-br from-[var(--verde)]/10 to-transparent border border-[var(--verde)]/20 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--verde)]">
                2026 Season
              </span>
              <ChevronDown className="h-4 w-4 text-[var(--verde)]" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Roster</span>
                <span className="font-semibold text-white">28/30</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: '93%' }} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Cap Space</span>
                <span className="font-semibold text-[var(--verde)]">$1.2M</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User */}
      <div className="border-t border-[var(--obsidian-lighter)] p-3">
        <div className={`flex items-center gap-3 ${!showFull ? 'justify-center' : ''}`}>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--verde)] to-[var(--verde-dark)] flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-black">DE</span>
          </div>
          {showFull && (
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/50">Fan GM Mode</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header - Always visible on mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[var(--obsidian)] border-b border-[var(--obsidian-lighter)] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--verde)] to-[var(--verde-dark)] flex items-center justify-center">
            <span className="font-display text-base text-black font-bold">A</span>
          </div>
          <h1 className="font-display text-base tracking-wide text-white">VERDE MANAGER</h1>
        </div>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-[var(--obsidian-lighter)] text-white/60 hover:text-white transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden fixed left-0 top-0 z-[70] h-screen w-[280px] bg-[var(--obsidian)] border-r border-[var(--obsidian-lighter)]"
          >
            {sidebarContent(true)}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex fixed left-0 top-0 z-40 h-screen border-r border-[var(--obsidian-lighter)] bg-[var(--obsidian)] overflow-hidden transition-all duration-200 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent(!isCollapsed)}
      </aside>
    </>
  );
}
