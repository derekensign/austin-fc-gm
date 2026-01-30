'use client';

import { motion } from 'framer-motion';
import { Users, DollarSign, Globe } from 'lucide-react';
import { StatCard } from '@/components/ui';
import { RosterOverview, SalaryCapCard, TeamStatsCard } from '@/components/dashboard';
import { AllocationProvider } from '@/context/AllocationContext';
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
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
      {/* Wrap in AllocationProvider so RosterOverview and SalaryCapCard share state */}
      <AllocationProvider>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 md:gap-3">
          {/* Roster Overview - 3 columns */}
          <div className="lg:col-span-3">
            <RosterOverview />
          </div>

          {/* Right Sidebar - 1 column */}
          <div className="space-y-3">
            <SalaryCapCard />
            <TeamStatsCard />
          </div>
        </div>
      </AllocationProvider>
    </div>
  );
}
