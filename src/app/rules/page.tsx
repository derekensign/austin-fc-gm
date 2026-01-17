'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { DollarSign, Users, Star, Globe, Calculator, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { 
  salaryCapRules, 
  dpRules, 
  allocationMoney, 
  u22Rules, 
  austinFCCompliance,
  canSignPlayer,
  formatBudget,
  getCapSpaceWithAllocation
} from '@/data/rules';

export default function RulesPage() {
  const [signingCalc, setSigningCalc] = useState({
    salary: 1000000,
    isInternational: false,
    age: 25,
    designation: 'Senior' as 'DP' | 'TAM' | 'U22' | 'Senior',
  });

  const signingResult = canSignPlayer(signingCalc);
  const compliance = austinFCCompliance;
  const totalCapSpace = getCapSpaceWithAllocation();

  return (
    <div className="p-4 md:p-6 stripe-pattern min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-display text-3xl text-white tracking-wide">
          ROSTER <span className="text-[var(--verde)]">RULES</span>
        </h1>
        <p className="text-white/60 text-sm mt-1">
          MLS roster compliance, salary cap, and signing regulations
        </p>
      </motion.div>

      {/* Compliance Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
      >
        <div className="stat-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-[var(--verde)]" />
            <p className="text-xs text-white/50 uppercase tracking-wider">Senior Roster</p>
          </div>
          <p className="font-display text-2xl text-white">
            {compliance.seniorRoster.current}/{compliance.seniorRoster.max}
          </p>
          <p className="text-xs text-[var(--verde)]">{compliance.seniorRoster.available} available</p>
        </div>
        <div className="stat-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 text-amber-400" />
            <p className="text-xs text-white/50 uppercase tracking-wider">DP Slots</p>
          </div>
          <p className="font-display text-2xl text-white">
            {compliance.dpSlots.used}/{compliance.dpSlots.max}
          </p>
          <p className="text-xs text-amber-400">{compliance.dpSlots.available} available</p>
        </div>
        <div className="stat-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-blue-400" />
            <p className="text-xs text-white/50 uppercase tracking-wider">Int'l Slots</p>
          </div>
          <p className="font-display text-2xl text-white">
            {compliance.internationalSlots.used}/{compliance.internationalSlots.max}
          </p>
          <p className="text-xs text-blue-400">{compliance.internationalSlots.available} available</p>
        </div>
        <div className="stat-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-[var(--verde)]" />
            <p className="text-xs text-white/50 uppercase tracking-wider">Total Cap Space</p>
          </div>
          <p className="font-display text-2xl text-[var(--verde)]">
            {formatBudget(totalCapSpace)}
          </p>
          <p className="text-xs text-white/40">incl. TAM/GAM</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rules Cards */}
        <div className="space-y-4">
          {/* Salary Cap Rules */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-[var(--obsidian-lighter)] bg-[var(--obsidian-light)] p-5"
          >
            <h2 className="font-display text-xl text-white mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[var(--verde)]" />
              SALARY CAP
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-[var(--obsidian-lighter)]">
                <span className="text-white/60">Salary Budget</span>
                <span className="font-semibold text-white">{formatBudget(salaryCapRules.salaryBudget)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--obsidian-lighter)]">
                <span className="text-white/60">Min Budget Charge</span>
                <span className="font-semibold text-white">{formatBudget(salaryCapRules.minimumBudgetCharge)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--obsidian-lighter)]">
                <span className="text-white/60">Max Budget Charge</span>
                <span className="font-semibold text-[var(--verde)]">{formatBudget(salaryCapRules.maxBudgetCharge)}</span>
              </div>
              <p className="text-xs text-white/40 mt-2">
                Players earning above max charge must be DPs or bought down with TAM/GAM
              </p>
            </div>
          </motion.div>

          {/* DP Rules */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-[var(--obsidian-lighter)] bg-[var(--obsidian-light)] p-5"
          >
            <h2 className="font-display text-xl text-white mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400" />
              DESIGNATED PLAYERS
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-[var(--obsidian-lighter)]">
                <span className="text-white/60">Max DP Slots</span>
                <span className="font-semibold text-white">{dpRules.maxSlots}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--obsidian-lighter)]">
                <span className="text-white/60">Budget Charge</span>
                <span className="font-semibold text-amber-400">{formatBudget(dpRules.budgetCharge)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--obsidian-lighter)]">
                <span className="text-white/60">Young DP Age Limit</span>
                <span className="font-semibold text-white">≤{dpRules.youngDPMaxAge}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-white/60">Young DP Charge</span>
                <span className="font-semibold text-purple-400">{formatBudget(dpRules.youngDPCharge)}</span>
              </div>
            </div>
          </motion.div>

          {/* Allocation Money */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-[var(--obsidian-lighter)] bg-[var(--obsidian-light)] p-5"
          >
            <h2 className="font-display text-xl text-white mb-4">ALLOCATION MONEY</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--obsidian)]/50 rounded-lg p-4">
                <p className="text-xs text-blue-400 uppercase tracking-wider mb-1">TAM</p>
                <p className="font-display text-2xl text-white">{formatBudget(allocationMoney.TAM.annual)}</p>
                <p className="text-xs text-white/40">per year</p>
                <p className="text-xs text-white/40 mt-2">Max/player: {formatBudget(allocationMoney.TAM.maxPerPlayer)}</p>
              </div>
              <div className="bg-[var(--obsidian)]/50 rounded-lg p-4">
                <p className="text-xs text-purple-400 uppercase tracking-wider mb-1">GAM</p>
                <p className="font-display text-2xl text-white">{formatBudget(allocationMoney.GAM.annual)}</p>
                <p className="text-xs text-white/40">per year</p>
                <p className="text-xs text-white/40 mt-2">Tradeable ✓</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-[var(--verde)]/10 rounded-lg border border-[var(--verde)]/20">
              <p className="text-xs text-white/60">
                <span className="text-[var(--verde)] font-semibold">Austin FC Available:</span>{' '}
                {formatBudget(compliance.salaryCapStatus.tamAvailable)} TAM + {formatBudget(compliance.salaryCapStatus.gamAvailable)} GAM
              </p>
            </div>
          </motion.div>
        </div>

        {/* Signing Calculator */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-[var(--obsidian-lighter)] bg-[var(--obsidian-light)] p-5 h-fit"
        >
          <h2 className="font-display text-xl text-white mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-[var(--verde)]" />
            SIGNING CALCULATOR
          </h2>
          <p className="text-sm text-white/50 mb-4">Check if Austin FC can sign a player</p>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/60 block mb-2">Annual Salary</label>
              <input
                type="range"
                min="100000"
                max="10000000"
                step="100000"
                value={signingCalc.salary}
                onChange={(e) => setSigningCalc({ ...signingCalc, salary: parseInt(e.target.value) })}
                className="w-full accent-[var(--verde)]"
              />
              <p className="text-right font-semibold text-[var(--verde)]">{formatBudget(signingCalc.salary)}</p>
            </div>

            <div>
              <label className="text-sm text-white/60 block mb-2">Player Age</label>
              <input
                type="number"
                min="16"
                max="40"
                value={signingCalc.age}
                onChange={(e) => setSigningCalc({ ...signingCalc, age: parseInt(e.target.value) })}
                className="w-full px-4 py-2 rounded-lg bg-[var(--obsidian)] border border-[var(--obsidian-lighter)] text-white"
              />
            </div>

            <div>
              <label className="text-sm text-white/60 block mb-2">Designation</label>
              <select
                value={signingCalc.designation}
                onChange={(e) => setSigningCalc({ ...signingCalc, designation: e.target.value as any })}
                className="w-full px-4 py-2 rounded-lg bg-[var(--obsidian)] border border-[var(--obsidian-lighter)] text-white"
              >
                <option value="Senior">Senior Roster</option>
                <option value="DP">Designated Player</option>
                <option value="TAM">TAM Player</option>
                <option value="U22">U22 Initiative</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="international"
                checked={signingCalc.isInternational}
                onChange={(e) => setSigningCalc({ ...signingCalc, isInternational: e.target.checked })}
                className="w-4 h-4 accent-[var(--verde)]"
              />
              <label htmlFor="international" className="text-sm text-white/60">
                Requires International Slot
              </label>
            </div>

            {/* Result */}
            <div className={`mt-6 p-4 rounded-lg border ${
              signingResult.canSign 
                ? 'bg-[var(--verde)]/10 border-[var(--verde)]/30' 
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                {signingResult.canSign ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-[var(--verde)]" />
                    <span className="font-semibold text-[var(--verde)]">CAN SIGN</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-400" />
                    <span className="font-semibold text-red-400">CANNOT SIGN</span>
                  </>
                )}
              </div>

              {signingResult.issues.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Issues</p>
                  {signingResult.issues.map((issue, i) => (
                    <p key={i} className="text-sm text-red-400 flex items-center gap-2">
                      <XCircle className="h-3 w-3" /> {issue}
                    </p>
                  ))}
                </div>
              )}

              {signingResult.recommendations.length > 0 && (
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Notes</p>
                  {signingResult.recommendations.map((rec, i) => (
                    <p key={i} className="text-sm text-white/70 flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 text-amber-400" /> {rec}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

