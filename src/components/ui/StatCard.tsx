'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number | string;
    isPositive: boolean;
  };
  delay?: number;
  isLive?: boolean;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, delay = 0, isLive = false }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="stat-card rounded-xl p-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-wider text-white/50">{title}</p>
            {isLive && (
              <span className="text-[8px] px-1 py-0.5 bg-[var(--verde)]/20 text-[var(--verde)] rounded">LIVE</span>
            )}
          </div>
          <p className="mt-1 font-display text-3xl tracking-tight text-white">{value}</p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-white/60">{subtitle}</p>
          )}
          {trend && (
            <div className={`mt-1 flex items-center gap-1 text-xs ${trend.isPositive ? 'text-[var(--verde)]' : 'text-red-400'}`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{typeof trend.value === 'number' ? `${Math.abs(trend.value)}%` : trend.value}</span>
            </div>
          )}
        </div>
        <div className="rounded-lg bg-[var(--verde)]/10 p-2">
          <Icon className="h-5 w-5 text-[var(--verde)]" />
        </div>
      </div>
    </motion.div>
  );
}
