'use client';

import { motion } from 'framer-motion';
import { Users, DollarSign, TrendingUp, TrendingDown, Globe, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { StatCard } from '@/components/ui';
import { RosterOverview, SalaryCapCard, TeamStatsCard, AllocationSimulator } from '@/components/dashboard';
import { 
  austinFCRoster, 
  calculateRosterCapSummary, 
  formatSalary,
  MLS_2026_RULES 
} from '@/data/austin-fc-roster';

export default function Dashboard() {
  const cap = calculateRosterCapSummary();

  // Calculate average age
  const averageAge = Math.round(
    austinFCRoster.reduce((sum, p) => sum + p.age, 0) / austinFCRoster.length * 10
  ) / 10;

  return (
    <div className="p-4 md:p-6 stripe-pattern min-h-screen w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h1 className="font-display text-2xl md:text-3xl text-white tracking-wide">
          AUSTIN FC <span className="text-[var(--verde)]">GM LAB</span>
        </h1>
        <p className="text-white/60 text-xs md:text-sm">
          Analyze roster composition, salary cap, and player performance
        </p>
      </motion.div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mb-4">
        <StatCard
          title="Roster Size"
          value={cap.totalPlayers}
          subtitle={`${cap.seniorRosterCount} senior / ${cap.supplementalRosterCount} supplemental`}
          icon={Users}
          delay={0.1}
        />
        <StatCard
          title="Budget Charge"
          value={formatSalary(cap.totalBudgetCharge)}
          subtitle={`needs ${formatSalary(Math.max(0, cap.totalBudgetCharge - MLS_2026_RULES.salaryBudget))} TAM/GAM`}
          icon={DollarSign}
          trend={{ 
            value: cap.totalBudgetCharge <= MLS_2026_RULES.salaryBudget 
              ? `${formatSalary(cap.capSpaceRemaining)} under cap` 
              : `Compliant after buydowns`, 
            isPositive: true 
          }}
          delay={0.15}
        />
        <StatCard
          title="Total Salary"
          value={formatSalary(cap.totalGuaranteedComp)}
          subtitle="Actual player salaries (MLSPA)"
          icon={DollarSign}
          trend={{ 
            value: `${formatSalary(cap.totalGuaranteedComp - cap.totalBudgetCharge)} bought down`, 
            isPositive: true 
          }}
          delay={0.2}
        />
        <StatCard
          title="International"
          value={`${cap.internationalSlotsUsed}/${MLS_2026_RULES.maxInternationalSlots}`}
          subtitle={`${cap.internationalSlotsAvailable} slots available`}
          icon={Globe}
          delay={0.25}
        />
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] rounded-lg p-3 text-center"
        >
          <p className="text-[10px] text-white/50 uppercase tracking-wider">DP Slots</p>
          <p className="font-display text-xl text-amber-400">{cap.dpSlotsUsed}<span className="text-white/30">/3</span></p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] rounded-lg p-3 text-center"
        >
          <p className="text-[10px] text-white/50 uppercase tracking-wider">U22 Slots</p>
          <p className="font-display text-xl text-purple-400">{cap.u22SlotsUsed}<span className="text-white/30">/3</span></p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] rounded-lg p-3 text-center"
        >
          <p className="text-[10px] text-white/50 uppercase tracking-wider">Avg Age</p>
          <p className="font-display text-xl text-white">{averageAge}</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] rounded-lg p-3 text-center"
        >
          <p className="text-[10px] text-white/50 uppercase tracking-wider">Homegrown</p>
          <p className="font-display text-xl text-green-400">{cap.homegrownCount}</p>
        </motion.div>
      </div>

      {/* Main Content Grid - 3:1 ratio matching the stats row above */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 md:gap-3">
        {/* Roster Overview - 3 columns */}
        <div className="lg:col-span-3">
          <RosterOverview />
        </div>

        {/* Right Sidebar - 1 column */}
        <div className="space-y-3">
          <SalaryCapCard />
          <AllocationSimulator />
          <TeamStatsCard />
        </div>
      </div>

      {/* Key Assumptions & Rules */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 bg-gradient-to-r from-[var(--verde)]/10 to-purple-500/10 border border-[var(--verde)]/30 rounded-xl p-4"
      >
        <h2 className="font-display text-sm text-white/70 mb-3 flex items-center gap-2">
          <Info className="h-4 w-4 text-[var(--verde)]" />
          2026 ALLOCATION POSITION (Calculated)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <span className="text-white font-medium">2026 GAM: +$3.53M</span>
              <p className="text-white/50">$3.28M annual + $0.25M distribution</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <DollarSign className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-white font-medium">TAM: $2.13M</span>
              <p className="text-white/50">Use-it-or-lose-it, used first for buydowns</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <span className="text-white font-medium">Free GAM: ~$2.23M</span>
              <p className="text-white/50">After estimated cap buydowns</p>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-white/40 mt-3">
          Source: Matthew Doyle analysis + Austin FC press releases + MLS CBA rules.
        </p>
      </motion.div>
    </div>
  );
}
