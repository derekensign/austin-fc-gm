'use client';

import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users } from 'lucide-react';
import { calculateRosterCapSummary, formatSalary, MLS_2026_RULES } from '@/data/austin-fc-roster';

export function SalaryCapCard() {
  const cap = calculateRosterCapSummary();
  
  const isOverCap = cap.capUsagePercent > 100;
  const capBarWidth = Math.min(cap.capUsagePercent, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl border border-[var(--obsidian-lighter)] bg-[var(--obsidian-light)] overflow-hidden"
    >
      <div className="border-b border-[var(--obsidian-lighter)] px-3 py-2 flex items-center justify-between">
        <h2 className="font-display text-sm text-white tracking-wide">SALARY CAP</h2>
        <span className="text-[9px] px-1.5 py-0.5 bg-[var(--verde)]/20 text-[var(--verde)] rounded">2026</span>
      </div>

      <div className="p-3 space-y-3">
        {/* Budget vs Budget Charge */}
        <div>
          <div className="flex items-end justify-between mb-1.5">
            <div>
              <p className="text-[10px] text-white/50">Budget</p>
              <p className="font-display text-lg text-white">{formatSalary(MLS_2026_RULES.salaryBudget)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/50">Charge</p>
              <p className={`font-display text-lg ${isOverCap ? 'text-red-400' : 'text-[var(--verde)]'}`}>
                {formatSalary(cap.totalBudgetCharge)}
              </p>
            </div>
          </div>
          
          <div className="h-2 bg-[var(--obsidian)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${capBarWidth}%` }}
              transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                cap.capUsagePercent > 95 
                  ? 'bg-gradient-to-r from-amber-500 to-red-500' 
                  : 'bg-gradient-to-r from-[var(--verde)] to-[var(--verde-dark)]'
              }`}
            />
          </div>
          
          <p className={`text-[10px] mt-1 text-right ${cap.capSpaceRemaining >= 0 ? 'text-white/40' : 'text-red-400'}`}>
            {cap.capSpaceRemaining >= 0 ? `${cap.capUsagePercent}%` : 'OVER CAP'}
          </p>
        </div>

        {/* TAM/GAM */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[var(--obsidian)]/50 rounded p-2">
            <p className="text-[9px] text-white/50 flex items-center gap-1">
              <DollarSign className="h-2.5 w-2.5 text-blue-400" />TAM
            </p>
            <p className="font-display text-sm text-blue-400">{formatSalary(cap.tamAvailable)}</p>
          </div>
          <div className="bg-[var(--obsidian)]/50 rounded p-2">
            <p className="text-[9px] text-white/50 flex items-center gap-1">
              <TrendingUp className="h-2.5 w-2.5 text-purple-400" />GAM
            </p>
            <p className="font-display text-sm text-purple-400">{formatSalary(cap.gamAvailable)}</p>
          </div>
        </div>

        {/* Roster Slots - Compact */}
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-white/50">DP</span>
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`h-2 w-2 rounded-full ${i < cap.dpSlotsUsed ? 'bg-amber-500' : 'bg-white/10'}`} />
              ))}
              <span className="text-white/30 ml-1">{cap.dpSlotsUsed}/3</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50">U22</span>
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`h-2 w-2 rounded-full ${i < cap.u22SlotsUsed ? 'bg-purple-500' : 'bg-white/10'}`} />
              ))}
              <span className="text-white/30 ml-1">{cap.u22SlotsUsed}/3</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50">INT</span>
            <div className="flex items-center gap-0.5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`h-1.5 w-1.5 rounded-full ${i < cap.internationalSlotsUsed ? 'bg-orange-500' : 'bg-white/10'}`} />
              ))}
              <span className="text-white/30 ml-1">{cap.internationalSlotsUsed}/8</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
            <span className="text-white/50">Senior</span>
            <span className="text-white/30">{cap.seniorRosterCount}/20</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50">Supp</span>
            <span className="text-white/30">{cap.supplementalRosterCount}/10</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

