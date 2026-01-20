'use client';

import { motion } from 'framer-motion';
import { useState, useMemo, useCallback } from 'react';
import { X, Sliders, Zap, Hand, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { 
  austinFCRoster, 
  getPlayersByPosition, 
  getFlag, 
  getDesignationBadge,
  formatSalary,
  MLS_2026_RULES,
  type PositionGroup,
  type AustinFCPlayer 
} from '@/data/austin-fc-roster';
import { AUSTIN_FC_2026_ALLOCATION_POSITION } from '@/data/austin-fc-allocation-money';
import { allocationMoney } from '@/data/mls-rules-2025';
import { 
  calculateAutoAllocation, 
  getTrueBudgetCharge, 
  isTAMEligible,
  type PlayerAllocation,
  type AllocationState,
} from '@/data/allocation-calculator';

const positionGroups: { key: PositionGroup; label: string; borderColor: string; textColor: string }[] = [
  { key: 'GK', label: 'GK', borderColor: 'border-l-amber-400', textColor: 'text-amber-400' },
  { key: 'DEF', label: 'DEF', borderColor: 'border-l-blue-400', textColor: 'text-blue-400' },
  { key: 'MID', label: 'MID', borderColor: 'border-l-emerald-400', textColor: 'text-emerald-400' },
  { key: 'FWD', label: 'FWD', borderColor: 'border-l-rose-400', textColor: 'text-rose-400' },
];

// Filter types
type FilterType = 'DP' | 'TAM' | 'U22' | 'INT' | 'HG' | 'SR' | 'SUP' | 'GA' | null;

// Filter definitions
const filterTags: { key: FilterType; label: string; bgColor: string; color: string; activeRing: string }[] = [
  { key: 'DP', label: 'DP', bgColor: 'bg-amber-500/20', color: 'text-amber-400', activeRing: 'ring-amber-400' },
  { key: 'TAM', label: 'TAM', bgColor: 'bg-blue-500/20', color: 'text-blue-400', activeRing: 'ring-blue-400' },
  { key: 'U22', label: 'U22', bgColor: 'bg-purple-500/20', color: 'text-purple-400', activeRing: 'ring-purple-400' },
  { key: 'INT', label: 'INT', bgColor: 'bg-orange-500/20', color: 'text-orange-400', activeRing: 'ring-orange-400' },
  { key: 'HG', label: 'HG', bgColor: 'bg-green-500/20', color: 'text-green-400', activeRing: 'ring-green-400' },
  { key: 'SR', label: 'SR', bgColor: 'bg-slate-500/20', color: 'text-slate-300', activeRing: 'ring-slate-300' },
  { key: 'SUP', label: 'SUP', bgColor: 'bg-pink-500/20', color: 'text-pink-400', activeRing: 'ring-pink-400' },
  { key: 'GA', label: 'GA', bgColor: 'bg-cyan-500/20', color: 'text-cyan-400', activeRing: 'ring-cyan-400' },
];

// Check if player matches filter
function playerMatchesFilter(player: AustinFCPlayer, filter: FilterType): boolean {
  if (!filter) return true;
  
  switch (filter) {
    case 'DP': return player.isDP;
    case 'TAM': return player.designation === 'TAM';
    case 'U22': return player.isU22;
    case 'INT': return player.isInternational;
    case 'HG': return player.isHomegrown;
    case 'SR': return player.rosterSlot === 'Senior' && !player.isDP && !player.isU22 && !player.isHomegrown && !player.isGenerationAdidas && player.designation !== 'TAM';
    case 'SUP': return player.rosterSlot === 'Supplemental';
    case 'GA': return player.isGenerationAdidas;
    default: return true;
  }
}

// ============================================================================
// GAM/TAM ALLOCATION HELPERS (imported from allocation-calculator.ts)
// ============================================================================

// Check if player needs buydown to get under max budget charge
function needsBuydown(player: AustinFCPlayer): boolean {
  // DPs and U22s have fixed charges, no buydown needed for cap compliance
  if (player.isDP || player.isU22) return false;
  // Supplemental don't count against cap
  if (player.rosterSlot === 'Supplemental') return false;
  // Senior roster players with charge above max need buydown
  return getTrueBudgetCharge(player) > MLS_2026_RULES.maxBudgetCharge;
}

// Calculate how much buydown a player needs
function getBuydownNeeded(player: AustinFCPlayer): number {
  if (!needsBuydown(player)) return 0;
  return Math.max(0, getTrueBudgetCharge(player) - MLS_2026_RULES.maxBudgetCharge);
}

// ============================================================================
// COMPONENTS
// ============================================================================

function PlayerAvatar({ player }: { player: AustinFCPlayer }) {
  const [imgError, setImgError] = useState(false);
  
  if (!player.photo || imgError) {
    return (
      <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-sm text-white/50 font-semibold border border-white/10">
        {player.number || '–'}
      </div>
    );
  }
  
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 bg-[#1a1a1a]">
      <img
        src={player.photo}
        alt={player.name}
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

interface PlayerRowProps {
  player: AustinFCPlayer;
  showValues: boolean;
  showAllocation: boolean;
  allocationMode: 'auto' | 'manual';
  allocation?: PlayerAllocation;
  tamRemaining: number;
  gamRemaining: number;
  onAllocationChange?: (playerId: number, type: 'tam' | 'gam', value: number) => void;
}

function PlayerRow({ 
  player, 
  showValues, 
  showAllocation,
  allocationMode,
  allocation,
  tamRemaining,
  gamRemaining,
  onAllocationChange,
}: PlayerRowProps) {
  const designation = getDesignationBadge(player);
  const flag = getFlag(player.nationality);
  
  const isSupplementalWithOtherDesignation = player.rosterSlot === 'Supplemental' && 
    (player.isHomegrown || player.isGenerationAdidas) && 
    designation.label !== 'SUP';
  
  const trueCharge = getTrueBudgetCharge(player);
  const buydownNeeded = getBuydownNeeded(player);
  const tamEligible = isTAMEligible(player);
  const amortizedFee = player.amortizedAnnualFee || 0;
  
  const tamApplied = allocation?.tamApplied || 0;
  const gamApplied = allocation?.gamApplied || 0;
  const totalApplied = tamApplied + gamApplied;
  const isFullyBoughtDown = buydownNeeded > 0 ? totalApplied >= buydownNeeded : true;
  
  // Calculate effective budget charge after buydowns
  const effectiveCharge = Math.max(0, trueCharge - totalApplied);
  
  return (
    <div className={`py-2 px-2.5 hover:bg-white/[0.03] border-b border-white/5 last:border-b-0 ${
      showAllocation && buydownNeeded > 0 && !isFullyBoughtDown ? 'bg-red-500/5' : ''
    }`}>
      <div className="flex items-center gap-2.5">
        {/* Number */}
        <span className="w-5 text-[11px] text-white/30 font-mono text-center shrink-0">
          {player.number || '–'}
        </span>
        
        {/* Photo */}
        <PlayerAvatar player={player} />
        
        {/* Player Info */}
        <div className="flex-1 min-w-0">
          {/* Line 1: Name */}
          <span className="text-sm font-medium text-white block truncate">{player.name}</span>
          
          {/* Line 2: Flag + Position + Badges + Salary */}
          <div className="flex items-center gap-1 mt-1">
            <span className="text-sm shrink-0">{flag}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-white/10 text-white/60">
              {player.position}
            </span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${designation.bgColor} ${designation.color}`}>
              {designation.label}
            </span>
            {isSupplementalWithOtherDesignation && (
              <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-pink-500/20 text-pink-400">
                SUP
              </span>
            )}
            {player.isInternational && (
              <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-orange-500/20 text-orange-400">
                INT
              </span>
            )}
            <span className="text-[11px] font-semibold text-[var(--verde)] ml-auto">
              {showValues ? formatSalary(player.marketValue) : formatSalary(player.guaranteedCompensation)}
            </span>
          </div>
          
          {/* Allocation Mode: Show additional info */}
          {showAllocation && (
            <div className="mt-2 pt-2 border-t border-white/5">
              {/* Amortized Fee (if any) */}
              {amortizedFee > 0 && (
                <div className="flex items-center justify-between text-[9px] mb-1">
                  <span className="text-white/40">+ Amortized Fee:</span>
                  <span className="text-amber-400 font-medium">{formatSalary(amortizedFee)}/yr</span>
                </div>
              )}
              
              {/* True Budget Charge */}
              <div className="flex items-center justify-between text-[9px] mb-1">
                <span className="text-white/40">True Charge:</span>
                <span className={`font-medium ${trueCharge > MLS_2026_RULES.maxBudgetCharge ? 'text-red-400' : 'text-white/70'}`}>
                  {formatSalary(trueCharge)}
                </span>
              </div>
              
              {/* Show applied allocations (both modes) */}
              {gamApplied > 0 && (
                <div className="flex items-center justify-between text-[9px] mb-1">
                  <span className="text-purple-400">GAM Applied:</span>
                  <span className="text-purple-400 font-medium">-{formatSalary(gamApplied)}</span>
                </div>
              )}
              {tamApplied > 0 && (
                <div className="flex items-center justify-between text-[9px] mb-1">
                  <span className="text-blue-400">TAM Applied:</span>
                  <span className="text-blue-400 font-medium">-{formatSalary(tamApplied)}</span>
                </div>
              )}
              
              {/* Effective charge after buydown */}
              {totalApplied > 0 && (
                <div className="flex items-center justify-between text-[9px] mb-1.5 pt-1 border-t border-white/5">
                  <span className="text-white/50">Effective Charge:</span>
                  <span className={`font-semibold ${effectiveCharge <= MLS_2026_RULES.maxBudgetCharge ? 'text-green-400' : 'text-red-400'}`}>
                    {formatSalary(effectiveCharge)}
                  </span>
                </div>
              )}
              
              {/* Buydown needed indicator (only if not fully bought down) */}
              {buydownNeeded > 0 && !isFullyBoughtDown && (
                <div className="flex items-center justify-between text-[9px] mb-1.5">
                  <span className="text-white/40">Needs Buydown:</span>
                  <span className="text-amber-400 font-medium">{formatSalary(buydownNeeded)}</span>
                </div>
              )}
              
              {/* TAM Eligibility Badge */}
              {tamEligible && buydownNeeded > 0 && (
                <div className="mb-1.5">
                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium">
                    TAM ELIGIBLE ($803K-$1.8M)
                  </span>
                </div>
              )}
              
              {/* Allocation Controls - Manual Mode: Show for ALL non-supplemental players */}
              {allocationMode === 'manual' && player.rosterSlot !== 'Supplemental' && (
                <div className="space-y-2 mt-2 pt-2 border-t border-white/5">
                  {/* GAM Slider - available to all non-supplemental */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[9px]">
                      <span className="text-purple-400 font-medium">GAM</span>
                      <span className="text-purple-400 font-mono">
                        {formatSalary(gamApplied)}
                      </span>
                    </div>
                    <input
                      id={`gam-slider-${player.id}`}
                      type="range"
                      min={0}
                      max={Math.min(
                        trueCharge, // Can't buy down more than total charge
                        gamRemaining + gamApplied // Available + what's already applied
                      )}
                      step={10000}
                      value={gamApplied}
                      onChange={(e) => onAllocationChange?.(player.id, 'gam', Number(e.target.value))}
                      disabled={tamApplied > 0} // Can't mix TAM and GAM
                      className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-purple-900/50 accent-purple-500 disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  {/* TAM Slider - only for TAM-eligible players ($803K-$1.8M) */}
                  {tamEligible && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[9px]">
                        <span className="text-blue-400 font-medium">TAM</span>
                        <span className="text-blue-400 font-mono">
                          {formatSalary(tamApplied)}
                        </span>
                      </div>
                      <input
                        id={`tam-slider-${player.id}`}
                        type="range"
                        min={0}
                        max={Math.min(
                          allocationMoney.TAM.maxBuydownPerPlayer, // Max $1M per player
                          trueCharge, // Can't buy down more than total charge
                          tamRemaining + tamApplied // Available + what's already applied
                        )}
                        step={10000}
                        value={tamApplied}
                        onChange={(e) => onAllocationChange?.(player.id, 'tam', Number(e.target.value))}
                        disabled={gamApplied > 0} // Can't mix TAM and GAM
                        className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-blue-900/50 accent-blue-500 disabled:opacity-30 disabled:cursor-not-allowed"
                      />
                    </div>
                  )}
                </div>
              )}
              
              {/* Status indicators */}
              <div className="flex items-center gap-2 mt-1.5">
                {buydownNeeded > 0 && isFullyBoughtDown && (
                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Bought Down
                  </span>
                )}
                {buydownNeeded > 0 && !isFullyBoughtDown && (
                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">
                    -{formatSalary(buydownNeeded - totalApplied)} short
                  </span>
                )}
                {player.rosterSlot === 'Supplemental' && (
                  <span className="text-[8px] text-pink-400/50">Supplemental — no cap impact</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function RosterOverview() {
  const [showValues, setShowValues] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [showAllocation, setShowAllocation] = useState(false);
  const [allocationMode, setAllocationMode] = useState<'auto' | 'manual'>('auto');
  const [manualAllocations, setManualAllocations] = useState<AllocationState>(() => 
    calculateAutoAllocation()
  );
  
  // Auto allocation (memoized)
  const autoAllocation = useMemo(() => calculateAutoAllocation(), []);
  
  // Current allocation state based on mode
  const currentAllocation = allocationMode === 'auto' ? autoAllocation : manualAllocations;
  
  // Calculate totals
  const totalTAM = AUSTIN_FC_2026_ALLOCATION_POSITION.tam.annualAllocation;
  const totalGAM = AUSTIN_FC_2026_ALLOCATION_POSITION.gam.available2026;
  const tamUsed = totalTAM - currentAllocation.tamRemaining;
  const gamUsed = totalGAM - currentAllocation.gamRemaining;
  
  // Calculate compliance
  const totalBuydownNeeded = austinFCRoster.reduce((sum, p) => sum + getBuydownNeeded(p), 0);
  const totalBuydownApplied = Array.from(currentAllocation.allocations.values())
    .reduce((sum, a) => sum + a.tamApplied + a.gamApplied, 0);
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
      
      const existing = prev.allocations.get(playerId) || { playerId, tamApplied: 0, gamApplied: 0 };
      const currentTam = existing.tamApplied;
      const currentGam = existing.gamApplied;
      
      let newTam = currentTam;
      let newGam = currentGam;
      let newTamRemaining = prev.tamRemaining;
      let newGamRemaining = prev.gamRemaining;
      
      if (type === 'tam') {
        if (!isTAMEligible(player)) return prev;
        const delta = value - currentTam;
        if (delta > newTamRemaining) {
          value = currentTam + newTamRemaining;
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
          value = currentGam + newGamRemaining;
        }
        newGamRemaining = newGamRemaining - (value - currentGam);
        newGam = value;
        // Reset TAM if applying GAM (no co-mingling)
        if (value > 0 && currentTam > 0) {
          newTamRemaining += currentTam;
          newTam = 0;
        }
      }
      
      const newAllocations = new Map(prev.allocations);
      newAllocations.set(playerId, { playerId, tamApplied: newTam, gamApplied: newGam });
      
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
  
  // Handle mode change - reset manual to auto defaults when switching to manual
  const handleModeChange = useCallback((newMode: 'auto' | 'manual') => {
    if (newMode === 'manual' && allocationMode === 'auto') {
      // Copy auto allocations to manual as starting point
      setManualAllocations(calculateAutoAllocation());
    }
    setAllocationMode(newMode);
  }, [allocationMode]);
  
  // Get filtered players count
  const filteredPlayers = austinFCRoster.filter(p => playerMatchesFilter(p, activeFilter));
  const totalPlayers = austinFCRoster.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-xl border border-[var(--obsidian-lighter)] bg-[var(--obsidian-light)] h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--obsidian-lighter)]">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-lg text-white tracking-wide">ROSTER OVERVIEW</h2>
          <span className={`text-xs px-2 py-1 rounded font-bold ${
            activeFilter ? 'bg-[var(--verde)]/20 text-[var(--verde)]' : 'bg-[var(--verde)] text-black'
          }`}>
            {activeFilter ? (
              <span>{filteredPlayers.length}<span className="text-white/40">/{totalPlayers}</span></span>
            ) : (
              totalPlayers
            )}
          </span>
          {activeFilter && (
            <span className="text-xs text-white/50">
              showing <span className={filterTags.find(t => t.key === activeFilter)?.color}>{activeFilter}</span> players
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* GAM/TAM Distribution Toggle */}
          <button
            onClick={() => setShowAllocation(!showAllocation)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors ${
              showAllocation 
                ? 'bg-[var(--verde)] text-black font-semibold' 
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            {showAllocation ? 'Hide' : 'Show'} GAM/TAM
          </button>
          <button
            onClick={() => setShowValues(!showValues)}
            className="text-xs px-3 py-1.5 rounded-md bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            {showValues ? 'Show Salary' : 'Show Value'}
          </button>
        </div>
      </div>

      {/* Allocation Mode Bar (when showAllocation is true) */}
      {showAllocation && (
        <div className="px-4 py-2 border-b border-[var(--obsidian-lighter)] bg-[var(--obsidian)]/30">
          <div className="flex items-center justify-between flex-wrap gap-2">
            {/* Mode Toggle */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-0.5 bg-[var(--obsidian)] rounded-md">
                <button
                  onClick={() => handleModeChange('auto')}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all ${
                    allocationMode === 'auto' 
                      ? 'bg-[var(--verde)] text-black' 
                      : 'text-white/50 hover:text-white/70'
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  Auto
                </button>
                <button
                  onClick={() => handleModeChange('manual')}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all ${
                    allocationMode === 'manual' 
                      ? 'bg-[var(--verde)] text-black' 
                      : 'text-white/50 hover:text-white/70'
                  }`}
                >
                  <Hand className="w-3 h-3" />
                  Manual
                </button>
              </div>
              
              {allocationMode === 'manual' && (
                <button
                  onClick={resetToAuto}
                  className="text-[9px] text-white/40 hover:text-white/60 underline"
                >
                  Reset
                </button>
              )}
            </div>
            
            {/* Pool Status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-blue-400">TAM:</span>
                <span className="text-[10px] text-white font-mono">{formatSalary(tamUsed)}</span>
                <span className="text-[9px] text-white/30">/ {formatSalary(totalTAM)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-purple-400">GAM:</span>
                <span className="text-[10px] text-white font-mono">{formatSalary(gamUsed)}</span>
                <span className="text-[9px] text-white/30">/ {formatSalary(totalGAM)}</span>
              </div>
            </div>
            
            {/* Compliance Status */}
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium ${
              isCompliant 
                ? 'bg-green-500/10 text-green-400' 
                : 'bg-red-500/10 text-red-400'
            }`}>
              {isCompliant ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  COMPLIANT
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  {formatSalary(shortfall)} SHORT
                </>
              )}
            </div>
          </div>
          
          {/* Rule Reminder */}
          <div className="flex items-center gap-1.5 mt-2 text-[9px] text-white/40">
            <Info className="w-3 h-3 text-blue-400 shrink-0" />
            <span>
              <span className="text-blue-400">TAM</span> only for players $803K-$1.8M • 
              Cannot mix TAM & GAM on same player • 
              TAM is use-it-or-lose-it
            </span>
          </div>
        </div>
      )}

      {/* Legend + Data Source Info */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--obsidian-lighter)]/50 text-[9px] flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {filterTags.map((tag) => {
            const isActive = activeFilter === tag.key;
            const count = austinFCRoster.filter(p => playerMatchesFilter(p, tag.key)).length;
            return (
              <button
                key={tag.key}
                onClick={() => setActiveFilter(isActive ? null : tag.key)}
                className={`px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer hover:scale-105 ${tag.bgColor} ${tag.color} ${
                  isActive ? `ring-2 ${tag.activeRing} ring-offset-1 ring-offset-[var(--obsidian)]` : 'opacity-70 hover:opacity-100'
                }`}
                title={`${tag.label}: ${count} players`}
              >
                {tag.label}
                {isActive && <span className="ml-1 text-[8px]">({count})</span>}
              </button>
            );
          })}
          {activeFilter && (
            <button
              onClick={() => setActiveFilter(null)}
              className="px-1.5 py-0.5 rounded font-bold bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-0.5"
              title="Clear filter"
            >
              <X className="w-2.5 h-2.5" />
              Clear
            </button>
          )}
        </div>
        <div className="text-[8px] text-white/40">
          {showValues ? (
            <span>📊 Market Value from{' '}
              <a 
                href="https://www.transfermarkt.us/austin-fc/startseite/verein/72309" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Transfermarkt
              </a>
              {' '}(Est. Jan 2026)
            </span>
          ) : (
            <span>💰 Salary from{' '}
              <a 
                href="https://mlsplayers.org/resources/salary-guide" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 underline"
              >
                MLSPA
              </a>
              {' '}(Oct 2025)
            </span>
          )}
        </div>
      </div>

      {/* Roster Columns */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
          {positionGroups.map((group, groupIndex) => {
            const allPlayers = getPlayersByPosition(group.key);
            const players = allPlayers.filter(p => playerMatchesFilter(p, activeFilter));
            const hasFilteredOut = allPlayers.length !== players.length;
            
            return (
              <motion.div
                key={group.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + groupIndex * 0.05 }}
                className={`rounded-lg bg-[#0a0a0a] border-l-2 ${group.borderColor} overflow-hidden ${
                  activeFilter && players.length === 0 ? 'opacity-40' : ''
                }`}
              >
                {/* Section Header */}
                <div className="flex items-center justify-between px-3 py-2 bg-white/[0.02]">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold tracking-wide ${group.textColor}`}>
                      {group.label}
                    </span>
                    <span className="text-[10px] text-white/30">
                      {hasFilteredOut ? (
                        <span>
                          <span className="text-white/60">{players.length}</span>
                          <span className="text-white/20">/{allPlayers.length}</span>
                        </span>
                      ) : (
                        players.length
                      )}
                    </span>
                  </div>
                  <span className="text-[8px] text-white/40 uppercase tracking-wide">
                    {showValues ? 'Value' : 'Salary'}
                  </span>
                </div>
                
                {/* Player List */}
                <div>
                  {players.length > 0 ? (
                    players.map((player) => (
                      <PlayerRow 
                        key={player.id} 
                        player={player}
                        showValues={showValues}
                        showAllocation={showAllocation}
                        allocationMode={allocationMode}
                        allocation={currentAllocation.allocations.get(player.id)}
                        tamRemaining={currentAllocation.tamRemaining}
                        gamRemaining={currentAllocation.gamRemaining}
                        onAllocationChange={handleAllocationChange}
                      />
                    ))
                  ) : (
                    <div className="py-4 px-3 text-center text-[10px] text-white/30">
                      No {activeFilter} players
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
