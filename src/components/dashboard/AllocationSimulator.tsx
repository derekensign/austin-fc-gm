'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  Settings2, 
  Zap, 
  Hand, 
  RefreshCcw,
  Info,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { 
  austinFCRoster, 
  formatSalary, 
  MLS_2026_RULES,
  type AustinFCPlayer,
} from '@/data/austin-fc-roster';
import { AUSTIN_FC_2026_ALLOCATION_POSITION } from '@/data/austin-fc-allocation-money';
import { allocationMoney } from '@/data/mls-rules-2025';

// Types
interface PlayerAllocation {
  playerId: number;
  tamApplied: number;
  gamApplied: number;
}

interface AllocationState {
  allocations: PlayerAllocation[];
  tamRemaining: number;
  gamRemaining: number;
}

// Helper to determine if player is TAM-eligible
function isTAMEligible(player: AustinFCPlayer): boolean {
  // DPs, U22s, and Supplemental players are not TAM-eligible
  if (player.isDP || player.isU22 || player.rosterSlot === 'Supplemental') return false;
  
  // TAM can only be used on players with budget charges between $803K and $1.803M
  const charge = player.guaranteedCompensation;
  return charge > allocationMoney.TAM.minSalaryToQualify && 
         charge <= allocationMoney.TAM.maxCompensationCeiling;
}

// Helper to determine if player needs buydown
function needsBuydown(player: AustinFCPlayer): boolean {
  // DPs and U22s have fixed charges, no buydown needed
  if (player.isDP || player.isU22) return false;
  // Supplemental don't count against cap
  if (player.rosterSlot === 'Supplemental') return false;
  // Senior roster players above max budget charge need buydown
  return player.guaranteedCompensation > MLS_2026_RULES.maxBudgetCharge;
}

// Get players that need buydown (sorted by salary desc)
function getPlayersNeedingBuydown(): AustinFCPlayer[] {
  return austinFCRoster
    .filter(p => needsBuydown(p))
    .sort((a, b) => b.guaranteedCompensation - a.guaranteedCompensation);
}

// Calculate auto allocation (TAM first, then GAM)
function calculateAutoAllocation(): AllocationState {
  const playersNeedingBuydown = getPlayersNeedingBuydown();
  
  let tamRemaining = AUSTIN_FC_2026_ALLOCATION_POSITION.tam.annualAllocation;
  let gamRemaining = AUSTIN_FC_2026_ALLOCATION_POSITION.gam.available2026;
  
  const allocations: PlayerAllocation[] = [];
  
  playersNeedingBuydown.forEach(player => {
    const buydownNeeded = player.guaranteedCompensation - MLS_2026_RULES.maxBudgetCharge;
    let tamApplied = 0;
    let gamApplied = 0;
    
    if (buydownNeeded > 0) {
      // Check if TAM-eligible
      if (isTAMEligible(player)) {
        // Apply TAM first (up to what's needed or what's available)
        tamApplied = Math.min(buydownNeeded, tamRemaining);
        tamRemaining -= tamApplied;
      }
      
      // If still needs more buydown, use GAM (no TAM/GAM co-mingling per rules)
      // However, since TAM is use-it-or-lose-it, we prioritize TAM
      // GAM is only used if TAM is exhausted OR player is not TAM-eligible
      if (tamApplied < buydownNeeded && !isTAMEligible(player)) {
        gamApplied = Math.min(buydownNeeded, gamRemaining);
        gamRemaining -= gamApplied;
      } else if (tamApplied < buydownNeeded && isTAMEligible(player) && tamRemaining === 0) {
        // TAM exhausted, use GAM for remainder
        const stillNeeded = buydownNeeded - tamApplied;
        gamApplied = Math.min(stillNeeded, gamRemaining);
        gamRemaining -= gamApplied;
      }
    }
    
    allocations.push({
      playerId: player.id,
      tamApplied,
      gamApplied,
    });
  });
  
  return { allocations, tamRemaining, gamRemaining };
}

export function AllocationSimulator() {
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [expanded, setExpanded] = useState(false);
  const [manualAllocations, setManualAllocations] = useState<AllocationState>(() => 
    calculateAutoAllocation()
  );

  // Auto allocation (memoized)
  const autoAllocation = useMemo(() => calculateAutoAllocation(), []);
  
  // Current state based on mode
  const currentState = mode === 'auto' ? autoAllocation : manualAllocations;
  
  // Calculate totals
  const totalTAM = AUSTIN_FC_2026_ALLOCATION_POSITION.tam.annualAllocation;
  const totalGAM = AUSTIN_FC_2026_ALLOCATION_POSITION.gam.available2026;
  
  const tamUsed = totalTAM - currentState.tamRemaining;
  const gamUsed = totalGAM - currentState.gamRemaining;
  
  // Calculate compliance
  const playersNeedingBuydown = getPlayersNeedingBuydown();
  const totalBuydownNeeded = playersNeedingBuydown.reduce((sum, p) => {
    const needed = p.guaranteedCompensation - MLS_2026_RULES.maxBudgetCharge;
    return sum + Math.max(0, needed);
  }, 0);
  
  const totalBuydownApplied = currentState.allocations.reduce((sum, a) => 
    sum + a.tamApplied + a.gamApplied, 0
  );
  
  const isCompliant = totalBuydownApplied >= totalBuydownNeeded;
  const shortfall = totalBuydownNeeded - totalBuydownApplied;
  
  // Handle manual allocation change
  const handleAllocationChange = useCallback((
    playerId: number, 
    type: 'tam' | 'gam', 
    value: number
  ) => {
    setManualAllocations(prev => {
      const player = austinFCRoster.find(p => p.id === playerId);
      if (!player) return prev;
      
      const existingAlloc = prev.allocations.find(a => a.playerId === playerId);
      const currentTam = existingAlloc?.tamApplied || 0;
      const currentGam = existingAlloc?.gamApplied || 0;
      
      let newTam = currentTam;
      let newGam = currentGam;
      let newTamRemaining = prev.tamRemaining;
      let newGamRemaining = prev.gamRemaining;
      
      if (type === 'tam') {
        // Validate TAM eligibility
        if (!isTAMEligible(player)) {
          return prev; // Can't apply TAM to non-eligible player
        }
        const delta = value - currentTam;
        if (delta > newTamRemaining) {
          value = currentTam + newTamRemaining; // Cap at available
        }
        newTamRemaining = newTamRemaining - (value - currentTam);
        newTam = value;
        // Reset GAM if applying TAM (no co-mingling)
        if (value > 0 && currentGam > 0) {
          newGamRemaining += currentGam;
          newGam = 0;
        }
      } else {
        const delta = value - currentGam;
        if (delta > newGamRemaining) {
          value = currentGam + newGamRemaining; // Cap at available
        }
        newGamRemaining = newGamRemaining - (value - currentGam);
        newGam = value;
        // Reset TAM if applying GAM (no co-mingling)
        if (value > 0 && currentTam > 0) {
          newTamRemaining += currentTam;
          newTam = 0;
        }
      }
      
      const newAllocations = prev.allocations.map(a => 
        a.playerId === playerId 
          ? { ...a, tamApplied: newTam, gamApplied: newGam }
          : a
      );
      
      // Add if not exists
      if (!newAllocations.find(a => a.playerId === playerId)) {
        newAllocations.push({ playerId, tamApplied: newTam, gamApplied: newGam });
      }
      
      return {
        allocations: newAllocations,
        tamRemaining: newTamRemaining,
        gamRemaining: newGamRemaining,
      };
    });
  }, []);
  
  // Reset to auto
  const resetToAuto = useCallback(() => {
    setManualAllocations(calculateAutoAllocation());
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-xl border border-[var(--obsidian-lighter)] bg-[var(--obsidian-light)] overflow-hidden"
    >
      {/* Header */}
      <div className="border-b border-[var(--obsidian-lighter)] px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-sm text-white tracking-wide">GAM/TAM SIMULATOR</h2>
          <span className="text-[9px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded">BETA</span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 hover:bg-white/5 rounded transition-colors"
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-white/50" />
          ) : (
            <ChevronDown className="h-4 w-4 text-white/50" />
          )}
        </button>
      </div>

      <div className="p-3 space-y-3">
        {/* Mode Toggle */}
        <div className="flex items-center gap-2 p-1 bg-[var(--obsidian)] rounded-lg">
          <button
            onClick={() => setMode('auto')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[11px] font-medium transition-all ${
              mode === 'auto' 
                ? 'bg-[var(--verde)] text-black' 
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <Zap className="h-3 w-3" />
            Auto
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[11px] font-medium transition-all ${
              mode === 'manual' 
                ? 'bg-[var(--verde)] text-black' 
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <Hand className="h-3 w-3" />
            Manual
          </button>
        </div>

        {/* Pool Status */}
        <div className="grid grid-cols-2 gap-2">
          {/* TAM Pool */}
          <div className="bg-[var(--obsidian)]/50 rounded p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-blue-400 font-medium">TAM</span>
              <span className="text-[10px] text-white/30">use-it-or-lose-it</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] text-white/50">Used</span>
              <span className="font-display text-sm text-blue-400">{formatSalary(tamUsed)}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] text-white/50">Remaining</span>
              <span className="font-display text-sm text-white">{formatSalary(currentState.tamRemaining)}</span>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 bg-[var(--obsidian)] rounded-full mt-1.5 overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${(tamUsed / totalTAM) * 100}%` }}
              />
            </div>
          </div>

          {/* GAM Pool */}
          <div className="bg-[var(--obsidian)]/50 rounded p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-purple-400 font-medium">GAM</span>
              <span className="text-[10px] text-green-400/50">tradeable</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] text-white/50">Used</span>
              <span className="font-display text-sm text-purple-400">{formatSalary(gamUsed)}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] text-white/50">Remaining</span>
              <span className="font-display text-sm text-white">{formatSalary(currentState.gamRemaining)}</span>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 bg-[var(--obsidian)] rounded-full mt-1.5 overflow-hidden">
              <div 
                className="h-full bg-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${(gamUsed / totalGAM) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Compliance Status */}
        <div className={`flex items-center justify-between p-2 rounded ${
          isCompliant 
            ? 'bg-green-500/10 border border-green-500/20' 
            : 'bg-red-500/10 border border-red-500/20'
        }`}>
          <div className="flex items-center gap-1.5">
            {isCompliant ? (
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-400" />
            )}
            <span className={`text-[11px] font-medium ${isCompliant ? 'text-green-400' : 'text-red-400'}`}>
              {isCompliant ? 'CAP COMPLIANT' : 'NOT COMPLIANT'}
            </span>
          </div>
          {!isCompliant && (
            <span className="text-[10px] text-red-400/70">
              Need {formatSalary(shortfall)} more
            </span>
          )}
        </div>

        {/* TAM Eligibility Note */}
        <div className="flex items-start gap-1.5 p-2 bg-blue-500/5 border border-blue-500/10 rounded">
          <Info className="h-3 w-3 text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-[10px] text-white/50">
            <span className="text-blue-400 font-medium">TAM Rule:</span> Only for players with charges between {formatSalary(allocationMoney.TAM.minSalaryToQualify)} - {formatSalary(allocationMoney.TAM.maxCompensationCeiling)}. Cannot mix TAM & GAM on same player.
          </p>
        </div>

        {/* Expanded Player List */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {/* Reset Button (Manual mode only) */}
              {mode === 'manual' && (
                <div className="flex justify-end mb-2">
                  <button
                    onClick={resetToAuto}
                    className="flex items-center gap-1 text-[10px] text-white/50 hover:text-white/70 transition-colors"
                  >
                    <RefreshCcw className="h-3 w-3" />
                    Reset to Auto
                  </button>
                </div>
              )}

              {/* Players needing buydown */}
              <div className="space-y-2">
                <p className="text-[10px] text-white/40 uppercase tracking-wider">
                  Players Requiring Buydown ({playersNeedingBuydown.length})
                </p>
                
                {playersNeedingBuydown.length === 0 ? (
                  <p className="text-[11px] text-white/50 py-2">
                    No players require buydown - all under max budget charge!
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                    {playersNeedingBuydown.map(player => {
                      const alloc = currentState.allocations.find(a => a.playerId === player.id);
                      const tamApplied = alloc?.tamApplied || 0;
                      const gamApplied = alloc?.gamApplied || 0;
                      const buydownNeeded = player.guaranteedCompensation - MLS_2026_RULES.maxBudgetCharge;
                      const buydownApplied = tamApplied + gamApplied;
                      const isFullyBoughtDown = buydownApplied >= buydownNeeded;
                      const tamEligible = isTAMEligible(player);
                      
                      return (
                        <div 
                          key={player.id}
                          className={`p-2 rounded border ${
                            isFullyBoughtDown 
                              ? 'bg-green-500/5 border-green-500/20' 
                              : 'bg-[var(--obsidian)]/50 border-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-white font-medium">{player.name}</span>
                              {tamEligible && (
                                <span className="text-[9px] px-1 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                                  TAM ✓
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-white/50">
                                Salary: {formatSalary(player.guaranteedCompensation)}
                              </p>
                              <p className="text-[10px] text-amber-400">
                                Needs: {formatSalary(buydownNeeded)}
                              </p>
                            </div>
                          </div>

                          {mode === 'manual' ? (
                            <div className="space-y-1.5">
                              {/* TAM Slider (only if eligible) */}
                              {tamEligible && (
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] text-blue-400 w-8">TAM</span>
                                  <input
                                    type="range"
                                    min={0}
                                    max={Math.min(buydownNeeded, currentState.tamRemaining + tamApplied)}
                                    step={10000}
                                    value={tamApplied}
                                    onChange={(e) => handleAllocationChange(player.id, 'tam', Number(e.target.value))}
                                    disabled={gamApplied > 0}
                                    className="flex-1 h-1.5 accent-blue-500 disabled:opacity-30"
                                  />
                                  <span className="text-[10px] text-blue-400 w-14 text-right">
                                    {formatSalary(tamApplied)}
                                  </span>
                                </div>
                              )}

                              {/* GAM Slider */}
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-purple-400 w-8">GAM</span>
                                <input
                                  type="range"
                                  min={0}
                                  max={Math.min(buydownNeeded, currentState.gamRemaining + gamApplied)}
                                  step={10000}
                                  value={gamApplied}
                                  onChange={(e) => handleAllocationChange(player.id, 'gam', Number(e.target.value))}
                                  disabled={tamApplied > 0}
                                  className="flex-1 h-1.5 accent-purple-500 disabled:opacity-30"
                                />
                                <span className="text-[10px] text-purple-400 w-14 text-right">
                                  {formatSalary(gamApplied)}
                                </span>
                              </div>
                            </div>
                          ) : (
                            /* Auto mode display */
                            <div className="flex items-center gap-2">
                              {tamApplied > 0 && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                                  TAM: {formatSalary(tamApplied)}
                                </span>
                              )}
                              {gamApplied > 0 && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded">
                                  GAM: {formatSalary(gamApplied)}
                                </span>
                              )}
                              {buydownApplied === 0 && (
                                <span className="text-[10px] text-red-400/70">Not allocated</span>
                              )}
                              {isFullyBoughtDown && (
                                <CheckCircle2 className="h-3 w-3 text-green-400 ml-auto" />
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary */}
        <div className="pt-2 border-t border-white/5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white/50">Buydowns Applied</span>
            <span className="text-white font-medium">{formatSalary(totalBuydownApplied)}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white/50">Buydowns Needed</span>
            <span className="text-white/70">{formatSalary(totalBuydownNeeded)}</span>
          </div>
          {mode === 'manual' && (
            <div className="flex items-center justify-between text-[11px] mt-1 pt-1 border-t border-white/5">
              <span className="text-white/50">Free for Trades</span>
              <span className="text-[var(--verde)] font-medium">
                {formatSalary(currentState.gamRemaining)} GAM
              </span>
            </div>
          )}
        </div>

        {/* Expand/Collapse hint */}
        {!expanded && (
          <button 
            onClick={() => setExpanded(true)}
            className="w-full text-center text-[10px] text-white/30 hover:text-white/50 transition-colors py-1"
          >
            Click to expand and {mode === 'manual' ? 'customize allocations' : 'see details'} →
          </button>
        )}
      </div>
    </motion.div>
  );
}

