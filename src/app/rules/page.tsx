'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { DollarSign, Users, Star, Globe, Calculator, CheckCircle, XCircle, AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';
import { 
  salaryCapRules, 
  dpRules, 
  allocationMoney, 
  u22Rules, 
  getAustinFCCompliance,
  canSignPlayer,
  formatBudget,
  getCapSpaceWithAllocation,
  calculateTransferGAM
} from '@/data/rules';
import { AUSTIN_FC_2026_ALLOCATION_POSITION } from '@/data/austin-fc-allocation-money';

export default function TransferCalculatorPage() {
  const [signingCalc, setSigningCalc] = useState({
    salary: 1_000_000,
    transferFee: 0,
    contractYears: 3,
    isInternational: false,
    age: 25,
    designation: 'Senior' as 'DP' | 'TAM' | 'U22' | 'Senior',
  });

  const [saleCalc, setSaleCalc] = useState({
    saleFee: 5_000_000,
    acquisitionCost: 3_000_000,
    playerDesignation: 'Senior' as 'DP' | 'U22' | 'Homegrown' | 'GA' | 'Senior',
    playerSalary: 500_000,
    playerAge: 25,
    isHomegrown: false,
  });

  const compliance = useMemo(() => getAustinFCCompliance(), []);
  const signingResult = canSignPlayer(signingCalc);
  const saleResult = calculateTransferGAM(saleCalc);
  const totalCapSpace = getCapSpaceWithAllocation();
  const allocPosition = AUSTIN_FC_2026_ALLOCATION_POSITION;

  return (
    <div className="p-4 md:p-6 stripe-pattern min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-display text-3xl text-white tracking-wide">
          TRANSFER <span className="text-[var(--verde)]">CALCULATOR</span>
        </h1>
        <p className="text-white/60 text-sm mt-1">
          Analyze signings, sales, and MLS roster compliance for Austin FC
        </p>
      </motion.div>

      {/* Current Status Cards */}
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
          <p className={`text-xs ${compliance.seniorRoster.available > 0 ? 'text-[var(--verde)]' : 'text-red-400'}`}>
            {compliance.seniorRoster.available} available
          </p>
        </div>
        <div className="stat-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 text-amber-400" />
            <p className="text-xs text-white/50 uppercase tracking-wider">DP Slots</p>
          </div>
          <p className="font-display text-2xl text-white">
            {compliance.dpSlots.used}/{compliance.dpSlots.max}
          </p>
          <p className={`text-xs ${compliance.dpSlots.available > 0 ? 'text-amber-400' : 'text-red-400'}`}>
            {compliance.dpSlots.available} available
          </p>
        </div>
        <div className="stat-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-blue-400" />
            <p className="text-xs text-white/50 uppercase tracking-wider">Int'l Slots</p>
          </div>
          <p className="font-display text-2xl text-white">
            {compliance.internationalSlots.used}/{compliance.internationalSlots.max}
          </p>
          <p className={`text-xs ${compliance.internationalSlots.available > 0 ? 'text-blue-400' : 'text-red-400'}`}>
            {compliance.internationalSlots.available} available
          </p>
        </div>
        <div className="stat-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-[var(--verde)]" />
            <p className="text-xs text-white/50 uppercase tracking-wider">Free Flexibility</p>
          </div>
          <p className="font-display text-2xl text-[var(--verde)]">
            {formatBudget(allocPosition.combined.totalFlexibility)}
          </p>
          <p className="text-xs text-white/40">
            {formatBudget(allocPosition.combined.freeTAM)} TAM + {formatBudget(allocPosition.combined.freeGAM)} GAM
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signing Calculator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-[var(--obsidian-lighter)] bg-[var(--obsidian-light)] p-5"
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
              <label className="text-sm text-white/60 block mb-2">Transfer Fee (if applicable)</label>
              <input
                type="range"
                min="0"
                max="20000000"
                step="500000"
                value={signingCalc.transferFee}
                onChange={(e) => setSigningCalc({ ...signingCalc, transferFee: parseInt(e.target.value) })}
                className="w-full accent-amber-400"
              />
              <p className="text-right font-semibold text-amber-400">{formatBudget(signingCalc.transferFee)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/60 block mb-2">Contract Years</label>
                <select
                  value={signingCalc.contractYears}
                  onChange={(e) => setSigningCalc({ ...signingCalc, contractYears: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--obsidian)] border border-[var(--obsidian-lighter)] text-white"
                >
                  <option value="1">1 year</option>
                  <option value="2">2 years</option>
                  <option value="3">3 years</option>
                  <option value="4">4 years</option>
                  <option value="5">5 years</option>
                </select>
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
            </div>

            <div>
              <label className="text-sm text-white/60 block mb-2">Designation</label>
              <select
                value={signingCalc.designation}
                onChange={(e) => setSigningCalc({ ...signingCalc, designation: e.target.value as 'DP' | 'TAM' | 'U22' | 'Senior' })}
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

            {/* Cost Breakdown */}
            {signingCalc.transferFee > 0 && (
              <div className="p-3 bg-[var(--obsidian)]/50 rounded-lg border border-white/10">
                <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Annual Cost Breakdown</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Salary</span>
                    <span className="text-[var(--verde)]">{formatBudget(signingCalc.salary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Amortized Fee ({formatBudget(signingCalc.transferFee)} ÷ {signingCalc.contractYears})</span>
                    <span className="text-amber-400">{formatBudget(Math.round(signingCalc.transferFee / signingCalc.contractYears))}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-white/10 font-semibold">
                    <span className="text-white/80">Total Annual Cost</span>
                    <span className="text-white">{formatBudget(signingCalc.salary + Math.round(signingCalc.transferFee / signingCalc.contractYears))}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Result */}
            <div className={`mt-6 p-4 rounded-lg border ${
              signingResult.canSign 
                ? 'bg-[var(--verde)]/10 border-[var(--verde)]/30' 
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
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
                <span className="text-sm text-white/60">
                  Cap hit: <span className={`font-semibold ${signingResult.canSign ? 'text-[var(--verde)]' : 'text-red-400'}`}>{formatBudget(signingResult.budgetImpact)}</span>
                </span>
              </div>

              {/* Buydown details if applicable */}
              {signingResult.canSign && signingResult.buydownNeeded > 0 && (
                <div className="mb-3 p-2 bg-blue-500/10 rounded border border-blue-500/20">
                  <p className="text-xs text-blue-400 uppercase tracking-wider mb-1">Allocation Money for Buydown</p>
                  <div className="flex gap-4 text-sm">
                    {signingResult.buydownUsed.tam > 0 && (
                      <span className="text-blue-400">TAM: {formatBudget(signingResult.buydownUsed.tam)}</span>
                    )}
                    {signingResult.buydownUsed.gam > 0 && (
                      <span className="text-purple-400">GAM: {formatBudget(signingResult.buydownUsed.gam)}</span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 mt-1">TAM used first (use-it-or-lose-it), then GAM</p>
                </div>
              )}

              {signingResult.issues.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Issues</p>
                  {signingResult.issues.map((issue, i) => (
                    <p key={i} className="text-sm text-red-400 flex items-center gap-2">
                      <XCircle className="h-3 w-3 flex-shrink-0" /> {issue}
                    </p>
                  ))}
                </div>
              )}

              {signingResult.recommendations.length > 0 && (
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Notes</p>
                  {signingResult.recommendations.map((rec, i) => (
                    <p key={i} className="text-sm text-white/70 flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 text-amber-400 flex-shrink-0" /> {rec}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Sale GAM Calculator */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-[var(--obsidian-lighter)] bg-[var(--obsidian-light)] p-5"
        >
          <h2 className="font-display text-xl text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-400" />
            SALE GAM CALCULATOR
          </h2>
          <p className="text-sm text-white/50 mb-4">Calculate GAM from selling a player abroad</p>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/60 block mb-2">Sale/Transfer Fee</label>
              <input
                type="range"
                min="0"
                max="20000000"
                step="500000"
                value={saleCalc.saleFee}
                onChange={(e) => setSaleCalc({ ...saleCalc, saleFee: parseInt(e.target.value) })}
                className="w-full accent-purple-400"
              />
              <p className="text-right font-semibold text-purple-400">{formatBudget(saleCalc.saleFee)}</p>
            </div>

            <div>
              <label className="text-sm text-white/60 block mb-2">Original Acquisition Cost</label>
              <input
                type="range"
                min="0"
                max="20000000"
                step="500000"
                value={saleCalc.acquisitionCost}
                onChange={(e) => setSaleCalc({ ...saleCalc, acquisitionCost: parseInt(e.target.value) })}
                className="w-full accent-amber-400"
              />
              <p className="text-right font-semibold text-amber-400">{formatBudget(saleCalc.acquisitionCost)}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-white/60 block mb-2">Player Designation</label>
                <select
                  value={saleCalc.playerDesignation}
                  onChange={(e) => setSaleCalc({ ...saleCalc, playerDesignation: e.target.value as typeof saleCalc.playerDesignation })}
                  className="w-full bg-[var(--obsidian)] text-white border border-white/20 rounded p-2 text-sm"
                >
                  <option value="Senior">Senior Roster</option>
                  <option value="DP">Designated Player</option>
                  <option value="U22">U22 Initiative</option>
                  <option value="Homegrown">Homegrown</option>
                  <option value="GA">Generation Adidas</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-white/60 block mb-2">Player Age</label>
                <input
                  type="number"
                  min="16"
                  max="40"
                  value={saleCalc.playerAge}
                  onChange={(e) => setSaleCalc({ ...saleCalc, playerAge: parseInt(e.target.value) || 25 })}
                  className="w-full bg-[var(--obsidian)] text-white border border-white/20 rounded p-2 text-sm"
                />
              </div>
            </div>

            {saleCalc.playerDesignation === 'DP' && (
              <div>
                <label className="text-sm text-white/60 block mb-2">DP Salary (for buydown eligibility)</label>
                <input
                  type="range"
                  min="500000"
                  max="5000000"
                  step="100000"
                  value={saleCalc.playerSalary}
                  onChange={(e) => setSaleCalc({ ...saleCalc, playerSalary: parseInt(e.target.value) })}
                  className="w-full accent-amber-400"
                />
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-white/40">TAM ceiling: {formatBudget(1_612_500)}</span>
                  <span className={`font-semibold ${saleCalc.playerSalary <= 1_612_500 ? 'text-[var(--verde)]' : 'text-red-400'}`}>
                    {formatBudget(saleCalc.playerSalary)}
                    {saleCalc.playerSalary <= 1_612_500 ? ' ✓ Buydown eligible' : ' ✗ Not buydown eligible'}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isHomegrown"
                checked={saleCalc.isHomegrown || saleCalc.playerDesignation === 'Homegrown'}
                disabled={saleCalc.playerDesignation === 'Homegrown'}
                onChange={(e) => setSaleCalc({ ...saleCalc, isHomegrown: e.target.checked })}
                className="w-4 h-4 accent-[var(--verde)]"
              />
              <label htmlFor="isHomegrown" className="text-sm text-white/60">
                Academy product (+15% GAM bonus)
              </label>
            </div>

            {/* Profit/Loss Summary */}
            <div className="p-3 bg-[var(--obsidian)]/50 rounded-lg border border-white/10">
              <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Sale Summary</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Sale Fee</span>
                  <span className="text-purple-400">{formatBudget(saleCalc.saleFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Acquisition Cost</span>
                  <span className="text-amber-400">-{formatBudget(saleCalc.acquisitionCost)}</span>
                </div>
                <div className={`flex justify-between pt-1 border-t border-white/10 font-semibold`}>
                  <span className="text-white/80">Net Profit/Loss</span>
                  <span className={saleCalc.saleFee > saleCalc.acquisitionCost ? 'text-[var(--verde)]' : 'text-red-400'}>
                    {saleCalc.saleFee >= saleCalc.acquisitionCost ? '' : '-'}
                    {formatBudget(Math.abs(saleCalc.saleFee - saleCalc.acquisitionCost))}
                  </span>
                </div>
              </div>
            </div>

            {/* Result */}
            <div className={`p-4 rounded-lg border ${
              saleResult.gamGenerated > 0 
                ? 'bg-purple-500/10 border-purple-500/30' 
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-white/50 uppercase tracking-wider">GAM Generated</span>
                <span className={`font-display text-2xl ${saleResult.gamGenerated > 0 ? 'text-purple-400' : 'text-red-400'}`}>
                  {formatBudget(saleResult.gamGenerated)}
                </span>
              </div>
              
              {/* Breakdown */}
              {saleResult.gamGenerated > 0 && (
                <div className="space-y-1 text-xs text-white/60 mb-3">
                  <div className="flex justify-between">
                    <span>Base GAM (tiered)</span>
                    <span>{formatBudget(saleResult.baseGAM)}</span>
                  </div>
                  {saleResult.homegrownBonus > 0 && (
                    <div className="flex justify-between text-[var(--verde)]">
                      <span>Homegrown Bonus (+15%)</span>
                      <span>+{formatBudget(saleResult.homegrownBonus)}</span>
                    </div>
                  )}
                  {saleResult.youngPlayerBonus > 0 && (
                    <div className="flex justify-between text-blue-400">
                      <span>U23 Bonus (+10%)</span>
                      <span>+{formatBudget(saleResult.youngPlayerBonus)}</span>
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-sm text-white/70">{saleResult.explanation}</p>
              
              {/* Warnings */}
              {saleResult.warnings && saleResult.warnings.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  {saleResult.warnings.map((warning, i) => (
                    <p key={i} className="text-xs text-amber-400 flex items-center gap-2 mt-1">
                      <AlertTriangle className="h-3 w-3 flex-shrink-0" /> {warning}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* GAM Conversion Rules Reference */}
            <div className="text-xs text-white/40 space-y-1 p-3 bg-[var(--obsidian)]/30 rounded border border-white/5">
              <p className="font-semibold text-white/60 mb-2">GAM Conversion Tiers (after fees):</p>
              <p>• First $1M of profit: 50% → GAM</p>
              <p>• $1M - $3M: 40% → GAM</p>
              <p>• $3M+: 25% → GAM</p>
              <p className="mt-2">Max: $3M GAM per sale • Fees: ~15% (MLS + agent)</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reference Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
      >
        {/* Salary Cap Rules */}
        <div className="rounded-xl border border-[var(--obsidian-lighter)] bg-[var(--obsidian-light)] p-5">
          <h3 className="font-display text-lg text-white mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-[var(--verde)]" />
            2026 SALARY CAP
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Budget</span>
              <span className="text-white font-semibold">{formatBudget(salaryCapRules.salaryBudget)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Max Charge</span>
              <span className="text-[var(--verde)]">{formatBudget(salaryCapRules.maxBudgetCharge)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Min Salary</span>
              <span className="text-white">{formatBudget(salaryCapRules.minimumBudgetCharge)}</span>
            </div>
          </div>
        </div>

        {/* DP Rules */}
        <div className="rounded-xl border border-[var(--obsidian-lighter)] bg-[var(--obsidian-light)] p-5">
          <h3 className="font-display text-lg text-white mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" />
            DESIGNATED PLAYERS
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Max Slots</span>
              <span className="text-white font-semibold">{dpRules.maxSlots}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Cap Charge</span>
              <span className="text-amber-400">{formatBudget(dpRules.budgetCharge)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Young DP (≤{dpRules.youngDPMaxAge})</span>
              <span className="text-purple-400">{formatBudget(dpRules.youngDPCharge)}</span>
            </div>
          </div>
        </div>

        {/* Allocation Money */}
        <div className="rounded-xl border border-[var(--obsidian-lighter)] bg-[var(--obsidian-light)] p-5">
          <h3 className="font-display text-lg text-white mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            ALLOCATION MONEY
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-400">TAM Annual</span>
              <span className="text-white">{formatBudget(allocationMoney.TAM.annual)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-400">GAM Annual</span>
              <span className="text-white">{formatBudget(allocationMoney.GAM.annual)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10">
              <span className="text-white/60">Austin FC Free</span>
              <span className="text-[var(--verde)] font-semibold">{formatBudget(allocPosition.combined.totalFlexibility)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Current DPs and U22s */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
      >
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <h4 className="text-sm text-amber-400 uppercase tracking-wider mb-2">Current DPs ({compliance.dpSlots.used}/3)</h4>
          <div className="flex flex-wrap gap-2">
            {compliance.dpSlots.players.map((player, i) => (
              <span key={i} className="px-3 py-1 bg-amber-500/20 rounded-full text-sm text-white">
                {player}
              </span>
            ))}
            {compliance.dpSlots.available > 0 && (
              <span className="px-3 py-1 border border-dashed border-amber-500/30 rounded-full text-sm text-amber-400/60">
                +{compliance.dpSlots.available} slot{compliance.dpSlots.available > 1 ? 's' : ''} available
              </span>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4">
          <h4 className="text-sm text-purple-400 uppercase tracking-wider mb-2">Current U22s ({compliance.u22Slots.used}/3)</h4>
          <div className="flex flex-wrap gap-2">
            {compliance.u22Slots.players.map((player, i) => (
              <span key={i} className="px-3 py-1 bg-purple-500/20 rounded-full text-sm text-white">
                {player}
              </span>
            ))}
            {compliance.u22Slots.available > 0 && (
              <span className="px-3 py-1 border border-dashed border-purple-500/30 rounded-full text-sm text-purple-400/60">
                +{compliance.u22Slots.available} slot{compliance.u22Slots.available > 1 ? 's' : ''} available
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
