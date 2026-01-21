'use client';

import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, ArrowUp, ArrowDown, AlertTriangle, Info } from 'lucide-react';
import { calculateRosterCapSummary, formatSalary, MLS_2026_RULES, AUSTIN_FC_2026_TRANSACTIONS } from '@/data/austin-fc-roster';
import { AUSTIN_FC_2026_ALLOCATION_POSITION } from '@/data/austin-fc-allocation-money';
import { useAllocation } from '@/context/AllocationContext';

export function SalaryCapCard() {
  const cap = calculateRosterCapSummary();
  
  // Get 2026 GAM/TAM allocation position (comprehensive calculation)
  const allocPosition = AUSTIN_FC_2026_ALLOCATION_POSITION;
  
  // Get LIVE allocation from shared context (updates when sliders change)
  const { currentAllocation, allocationMode } = useAllocation();
  
  // Create dynamicAlloc structure from context
  const dynamicAlloc = {
    tam: {
      total: allocPosition.tam.annualAllocation,
      used: currentAllocation.tamUsed,
      remaining: currentAllocation.tamRemaining,
    },
    gam: {
      total: allocPosition.gam.available2026,
      used: currentAllocation.gamUsed,
      remaining: currentAllocation.gamRemaining,
    },
  };
  
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
        {/* Actual Salary vs Budget Charge with Breakdown */}
        <div className="bg-[var(--obsidian)]/50 rounded p-2.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-white/50">Actual Salaries (MLSPA)</span>
            <span className="font-display text-base text-white">{formatSalary(cap.totalGuaranteedComp)}</span>
          </div>
          
          {/* Breakdown by mechanism */}
          <div className="pl-2 border-l border-white/10 space-y-1 text-[10px]">
            <div className="flex items-center justify-between">
              <span className="text-amber-400/70">DP Mechanism ({cap.dpCount})</span>
              <span className="text-amber-400">-{formatSalary(cap.dpSavings)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-purple-400/70">U22 Initiative ({cap.u22Count})</span>
              <span className="text-purple-400">-{formatSalary(cap.u22Savings)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-pink-400/70">Supplemental ({cap.supplementalRosterCount})</span>
              <span className="text-pink-400">-{formatSalary(cap.supplementalSavings)}</span>
            </div>
            {cap.tamGamBuydowns > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-blue-400/70">TAM/GAM Buydowns</span>
                <span className="text-blue-400">-{formatSalary(cap.tamGamBuydowns)}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between border-t border-white/10 pt-1.5">
            <span className="text-[11px] text-white/70 font-medium">Budget Charge</span>
            <span className={`font-display text-base font-bold ${isOverCap ? 'text-red-400' : 'text-[var(--verde)]'}`}>
              {formatSalary(cap.totalBudgetCharge)}
            </span>
          </div>
        </div>

        {/* Budget Compliance - DYNAMIC based on slider values */}
        <div>
          {(() => {
            // Calculate dynamic values based on slider state
            const preBuydownCharge = cap.totalBudgetCharge;
            const buydownsNeeded = Math.max(0, preBuydownCharge - MLS_2026_RULES.salaryBudget);
            const buydownsApplied = dynamicAlloc.tam.used + dynamicAlloc.gam.used;
            const finalBudgetCharge = Math.max(0, preBuydownCharge - buydownsApplied);
            const isCompliant = finalBudgetCharge <= MLS_2026_RULES.salaryBudget;
            const shortfall = buydownsNeeded - buydownsApplied;
            const compliancePercent = Math.min(100, (finalBudgetCharge / MLS_2026_RULES.salaryBudget) * 100);
            
            // If we need buydowns (over cap before buydowns)
            if (buydownsNeeded > 0) {
              return (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-white/50">Pre-Buydown</span>
                    <span className="text-[10px] text-amber-400">{formatSalary(preBuydownCharge)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-white/50">Needed</span>
                    <span className="text-[10px] text-amber-400">-{formatSalary(buydownsNeeded)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] ${isCompliant ? 'text-green-400' : 'text-blue-400'}`}>
                      Applied
                    </span>
                    <span className={`text-[10px] font-medium ${isCompliant ? 'text-green-400' : 'text-blue-400'}`}>
                      -{formatSalary(buydownsApplied)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-1.5 mb-2">
                    <span className="text-[11px] text-white/70 font-medium">Final Charge</span>
                    <span className={`font-display text-lg font-bold ${isCompliant ? 'text-[var(--verde)]' : 'text-red-400'}`}>
                      {formatSalary(finalBudgetCharge)}
                    </span>
                  </div>
                  
                  {/* Compliance bar */}
                  <div className="h-2 bg-[var(--obsidian)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${compliancePercent}%` }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className={`h-full rounded-full ${isCompliant 
                        ? 'bg-gradient-to-r from-[var(--verde)] to-[var(--verde-dark)]' 
                        : 'bg-gradient-to-r from-red-500 to-red-600'}`}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mt-1.5">
                    {isCompliant ? (
                      <p className="text-[10px] text-[var(--verde)] font-medium">✓ COMPLIANT</p>
                    ) : (
                      <p className="text-[10px] text-red-400 font-medium">✗ {formatSalary(shortfall)} over</p>
                    )}
                    <p className="text-[11px] text-white/40">
                      Budget: {formatSalary(MLS_2026_RULES.salaryBudget)}
                    </p>
                  </div>
                </>
              );
            }
            
            // Under cap even without buydowns
            return (
              <>
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <p className="text-[11px] text-white/50">Budget Cap</p>
                    <p className="font-display text-xl text-white">{formatSalary(MLS_2026_RULES.salaryBudget)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-white/50">Remaining</p>
                    <p className="font-display text-xl text-[var(--verde)]">
                      {formatSalary(MLS_2026_RULES.salaryBudget - finalBudgetCharge)}
                    </p>
                  </div>
                </div>
                
                <div className="h-2.5 bg-[var(--obsidian)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${compliancePercent}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-[var(--verde)] to-[var(--verde-dark)]"
                  />
                </div>
                
                <p className="text-[11px] mt-1.5 text-right text-white/40">
                  {Math.round(compliancePercent)}% used
                </p>
              </>
            );
          })()}
        </div>

        {/* TAM/GAM Allocation - Now using DYNAMIC calculation */}
        <div className="space-y-2">
          {/* TAM */}
          <div className="bg-[var(--obsidian)]/50 rounded p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[11px] text-white/50 flex items-center gap-1.5">
                <DollarSign className="h-3 w-3 text-blue-400" />TAM (2026)
              </p>
              <span className="text-[10px] text-white/30">use-it-or-lose-it</span>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-white/50">Annual Allocation</span>
                <span className="text-green-400">+{formatSalary(allocPosition.tam.annualAllocation)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Buydowns Applied</span>
                <span className="text-red-400">-{formatSalary(dynamicAlloc.tam.used)}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-white/10">
                <span className="text-white/70 font-medium">Available</span>
                <span className="font-display text-base text-blue-400">{formatSalary(dynamicAlloc.tam.remaining)}</span>
              </div>
            </div>
          </div>
          
          {/* GAM */}
          <div className="bg-[var(--obsidian)]/50 rounded p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[11px] text-white/50 flex items-center gap-1.5">
                <TrendingUp className="h-3 w-3 text-purple-400" />GAM (2026)
              </p>
              <span className="text-[10px] text-green-400/50">tradeable</span>
            </div>
            <div className="space-y-1 text-[11px]">
              {/* Annual Allocation */}
              <div className="flex items-center justify-between">
                <span className="text-white/50">Annual Allocation</span>
                <span className="text-green-400">+{formatSalary(allocPosition.gam.annualAllocation)}</span>
              </div>
              {/* Third DP Distribution */}
              {allocPosition.gam.thirdDPDistribution > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-white/50">3rd DP Distribution</span>
                  <span className="text-green-400">+{formatSalary(allocPosition.gam.thirdDPDistribution)}</span>
                </div>
              )}
              {/* Rolled Over from 2025 (includes Taylor trade deficit) */}
              {allocPosition.gam.taylorTrade2026 !== 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Rolled Over (2025)</span>
                  <span className="text-red-400">{formatSalary(allocPosition.gam.taylorTrade2026)}</span>
                </div>
              )}
              {/* Nelson Trade (2026 commitment) */}
              {allocPosition.gam.rolledOverDeficit !== 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Nelson Trade</span>
                  <span className="text-red-400">{formatSalary(allocPosition.gam.rolledOverDeficit)}</span>
                </div>
              )}
              {/* Subtotal - Available before buydowns */}
              <div className="flex items-center justify-between pt-1 border-t border-white/5">
                <span className="text-white/60">Available (pre-buydown)</span>
                <span className="text-white/80">{formatSalary(dynamicAlloc.gam.total)}</span>
              </div>
              {/* Buydowns Applied */}
              <div className="flex items-center justify-between">
                <span className="text-white/50">Buydowns Applied</span>
                <span className="text-red-400">-{formatSalary(dynamicAlloc.gam.used)}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-white/10">
                <span className="text-white/70 font-medium">Free GAM</span>
                <span className="font-display text-base text-purple-400">{formatSalary(dynamicAlloc.gam.remaining)}</span>
              </div>
            </div>
          </div>
          
          {/* Combined Flexibility */}
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded p-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-white/70 flex items-center gap-1.5">
                <Info className="h-3 w-3 text-purple-400" />Total Flexibility
              </p>
              <p className="font-display text-base text-white">{formatSalary(dynamicAlloc.tam.remaining + dynamicAlloc.gam.remaining)}</p>
            </div>
            <p className="text-[10px] text-white/40 mt-1">
              After cap compliance: {formatSalary(dynamicAlloc.gam.remaining)} GAM (tradeable) + {formatSalary(dynamicAlloc.tam.remaining)} TAM
            </p>
          </div>
        </div>

        {/* Roster Slots - Compact */}
        <div className="space-y-2 text-[12px]">
          <div className="flex items-center justify-between">
            <span className="text-white/50">DP</span>
            <div className="flex items-center gap-1.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`h-2.5 w-2.5 rounded-full ${i < cap.dpSlotsUsed ? 'bg-amber-500' : 'bg-white/10'}`} />
              ))}
              <span className="text-white/40 ml-1">{cap.dpSlotsUsed}/3</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50">U22</span>
            <div className="flex items-center gap-1.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`h-2.5 w-2.5 rounded-full ${i < cap.u22SlotsUsed ? 'bg-purple-500' : 'bg-white/10'}`} />
              ))}
              <span className="text-white/40 ml-1">{cap.u22SlotsUsed}/3</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50">INT</span>
            <div className="flex items-center gap-1">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`h-2 w-2 rounded-full ${i < cap.internationalSlotsUsed ? 'bg-orange-500' : 'bg-white/10'}`} />
              ))}
              <span className="text-white/40 ml-1">{cap.internationalSlotsUsed}/8</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <span className="text-white/50">Senior</span>
            <span className="text-white/40">{cap.seniorRosterCount}/20</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50">Supp</span>
            <span className="text-white/40">{cap.supplementalRosterCount}/10</span>
          </div>
        </div>

        {/* Transaction Mechanisms */}
        <div className="space-y-2 text-[12px] pt-2.5 border-t border-white/5">
          <p className="text-[10px] text-white/40 uppercase tracking-wide mb-1.5">Transaction Tools</p>
          <div className="flex items-center justify-between">
            <span className="text-white/50">Buyouts</span>
            <div className="flex items-center gap-1.5">
              {[...Array(MLS_2026_RULES.maxBuyoutsPerYear)].map((_, i) => (
                <div key={i} className={`h-2.5 w-2.5 rounded-full ${i < AUSTIN_FC_2026_TRANSACTIONS.buyoutsUsed ? 'bg-red-500' : 'bg-emerald-500'}`} />
              ))}
              <span className="text-white/40 ml-1">{AUSTIN_FC_2026_TRANSACTIONS.buyoutsAvailable}/{MLS_2026_RULES.maxBuyoutsPerYear}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50">Cash Transfers</span>
            <div className="flex items-center gap-1.5">
              {[...Array(MLS_2026_RULES.maxCashTransfersPerWindow)].map((_, i) => (
                <div key={i} className={`h-2.5 w-2.5 rounded-full ${i < AUSTIN_FC_2026_TRANSACTIONS.cashTransfersUsed ? 'bg-red-500' : 'bg-emerald-500'}`} />
              ))}
              <span className="text-white/40 ml-1">{AUSTIN_FC_2026_TRANSACTIONS.cashTransfersAvailable}/{MLS_2026_RULES.maxCashTransfersPerWindow}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

