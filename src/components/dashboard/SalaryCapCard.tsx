'use client';

import { motion } from 'framer-motion';
import { DollarSign, TrendingUp } from 'lucide-react';
import { salaryCap } from '@/data/roster';

export function SalaryCapCard() {
  const capUsagePercent = Math.round((salaryCap.capHits.senior / salaryCap.totalBudget) * 100);
  const isOverCap = capUsagePercent > 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl border border-[var(--obsidian-lighter)] bg-[var(--obsidian-light)] overflow-hidden"
    >
      <div className="border-b border-[var(--obsidian-lighter)] px-4 py-3">
        <h2 className="font-display text-lg text-white tracking-wide">SALARY CAP</h2>
        <p className="text-xs text-white/50">2026 MLS Season</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Main Cap */}
        <div>
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-xs text-white/50">Budget</p>
              <p className="font-display text-2xl text-white">
                ${(salaryCap.totalBudget / 1000000).toFixed(2)}M
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/50">Cap Hit</p>
              <p className={`font-display text-2xl ${isOverCap ? 'text-amber-400' : 'text-[var(--verde)]'}`}>
                ${(salaryCap.capHits.senior / 1000000).toFixed(2)}M
              </p>
            </div>
          </div>
          <div className="h-3 bg-[var(--obsidian)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(capUsagePercent, 100)}%` }}
              transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${isOverCap ? 'bg-gradient-to-r from-amber-500 to-red-500' : 'bg-gradient-to-r from-[var(--verde)] to-[var(--verde-dark)]'}`}
            />
          </div>
          <p className="text-xs text-white/40 mt-1 text-right">{capUsagePercent}% of cap</p>
        </div>

        {/* Allocation Money */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--obsidian)]/50 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <DollarSign className="h-3 w-3 text-blue-400" />
              <span className="text-xs text-white/60">TAM</span>
            </div>
            <p className="font-display text-lg text-blue-400">
              ${(salaryCap.availableTAM / 1000).toFixed(0)}K
            </p>
          </div>
          <div className="bg-[var(--obsidian)]/50 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-purple-400" />
              <span className="text-xs text-white/60">GAM</span>
            </div>
            <p className="font-display text-lg text-purple-400">
              ${(salaryCap.availableGAM / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>

        {/* Roster Slots - Compact */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">DP Slots</span>
            <div className="flex items-center gap-1">
              {[...Array(salaryCap.dpSlots.total)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full ${i < salaryCap.dpSlots.used ? 'bg-amber-500' : 'bg-[var(--obsidian-lighter)]'}`}
                />
              ))}
              <span className="text-xs text-white/40 ml-1">
                {salaryCap.dpSlots.used}/{salaryCap.dpSlots.total}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">U22 Initiative</span>
            <div className="flex items-center gap-1">
              {[...Array(salaryCap.u22Slots.total)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full ${i < salaryCap.u22Slots.used ? 'bg-purple-500' : 'bg-[var(--obsidian-lighter)]'}`}
                />
              ))}
              <span className="text-xs text-white/40 ml-1">
                {salaryCap.u22Slots.used}/{salaryCap.u22Slots.total}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Senior Roster</span>
            <span className="text-xs text-white/40">
              {salaryCap.seniorRosterSpots.used}/{salaryCap.seniorRosterSpots.total}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
