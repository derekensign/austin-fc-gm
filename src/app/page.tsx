'use client';

import { motion } from 'framer-motion';
import { Users, DollarSign, Trophy, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/ui';
import { RosterOverview, SalaryCapCard, TeamStatsCard } from '@/components/dashboard';
import { roster, teamStats, getAverageAge, getTotalSalary } from '@/data/roster';

export default function Dashboard() {
  const totalSalary = getTotalSalary();
  const averageAge = getAverageAge();

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
          value={roster.length}
          subtitle="Active players"
          icon={Users}
          delay={0.1}
        />
        <StatCard
          title="Total Payroll"
          value={`$${(totalSalary / 1000000).toFixed(1)}M`}
          subtitle="Annual salaries"
          icon={DollarSign}
          trend={{ value: 12, isPositive: false }}
          delay={0.15}
        />
        <StatCard
          title="Conference Rank"
          value={teamStats.position}
          subtitle={`${teamStats.conference} Conference`}
          icon={Trophy}
          trend={{ value: 2, isPositive: true }}
          delay={0.2}
        />
        <StatCard
          title="Avg. Age"
          value={averageAge}
          subtitle="Years old"
          icon={TrendingUp}
          delay={0.25}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Roster Overview - Full width on mobile, 2 cols on lg */}
        <div className="lg:col-span-2">
          <RosterOverview />
        </div>

        {/* Right Sidebar - Full width on mobile, 1 col on xl */}
        <div className="space-y-4">
          <SalaryCapCard />
          <TeamStatsCard />
        </div>
      </div>
    </div>
  );
}
