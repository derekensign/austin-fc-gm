'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';
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
  getTrueBudgetCharge, 
  isTAMEligible,
  getBuydownNeeded,
  type PlayerAllocation,
} from '@/data/allocation-calculator';
import { useAllocation } from '@/context/AllocationContext';

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
  onAllocationChange?: (playerId: number, type: 'tam' | 'gam', value: number) => void;
}

// Memoize PlayerRow to prevent re-renders when other players' allocations change
const PlayerRow = React.memo(function PlayerRow({ 
  player, 
  showValues, 
  showAllocation,
  allocationMode,
  allocation,
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
  
  const tamApplied = allocation?.tamApplied || 0;
  const gamApplied = allocation?.gamApplied || 0;
  const totalApplied = tamApplied + gamApplied;
  const isFullyBoughtDown = buydownNeeded > 0 ? totalApplied >= buydownNeeded : true;
  
  // Calculate effective budget charge after buydowns
  const effectiveCharge = Math.max(0, trueCharge - totalApplied);
  
  return (
    <div className={`py-1.5 sm:py-2 px-1.5 sm:px-2.5 hover:bg-white/[0.03] border-b border-white/5 last:border-b-0 ${
      showAllocation && buydownNeeded > 0 && !isFullyBoughtDown ? 'bg-red-500/5' : ''
    }`}>
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Number - hidden on mobile */}
        <span className="hidden sm:block w-5 text-[11px] text-white/30 font-mono text-center shrink-0">
          {player.number || '–'}
        </span>
        
        {/* Photo - smaller on mobile */}
        <div className="shrink-0">
          <PlayerAvatar player={player} />
        </div>
        
        {/* Player Info */}
        <div className="flex-1 min-w-0">
          {/* Line 1: Name */}
          <span className="text-xs sm:text-sm font-medium text-white block truncate">{player.name}</span>
          
          {/* Line 2: Flag + Position + Badges + Salary */}
          <div className="flex items-center gap-0.5 sm:gap-1 mt-0.5 sm:mt-1 flex-wrap">
            <span className="text-xs sm:text-sm shrink-0">{flag}</span>
            <span className="text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded font-bold bg-white/10 text-white/60">
              {player.position}
            </span>
            <span className={`text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded font-bold ${designation.bgColor} ${designation.color}`}>
              {designation.label}
            </span>
            {isSupplementalWithOtherDesignation && (
              <span className="hidden sm:inline text-[9px] px-1.5 py-0.5 rounded font-bold bg-pink-500/20 text-pink-400">
                SUP
              </span>
            )}
            {player.isInternational && (
              <span className="text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded font-bold bg-orange-500/20 text-orange-400">
                INT
              </span>
            )}
            <span className="text-[10px] sm:text-[11px] font-semibold text-[var(--verde)] ml-auto">
              {showValues ? formatSalary(player.marketValue) : formatSalary(player.guaranteedCompensation)}
            </span>
          </div>
          
          {/* Allocation Mode: Compact info display */}
          {showAllocation && (
            <div className="mt-1.5 pt-1.5 border-t border-white/5 text-[9px]">
              {player.rosterSlot === 'Supplemental' ? (
                <span className="text-pink-400/60 italic">Supplemental — no cap impact</span>
              ) : (
                <>
                  {/* Charge summary - single line when no buydown applied */}
                  {totalApplied === 0 ? (
                    <div className="flex items-center justify-between text-white/50">
                      <span>True Charge:</span>
                      <span className="font-medium text-white/70">{formatSalary(trueCharge)}</span>
                    </div>
                  ) : (
                    /* When buydown is applied, show the math */
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between text-white/40">
                        <span>{formatSalary(trueCharge)}</span>
                        <span className={totalApplied > 0 ? 'text-purple-400' : ''}>
                          {totalApplied > 0 && `- ${formatSalary(totalApplied)}`}
                        </span>
                        <span className="text-white/30">=</span>
                        <span className={`font-semibold ${effectiveCharge <= MLS_2026_RULES.maxBudgetCharge ? 'text-green-400' : 'text-amber-400'}`}>
                          {formatSalary(effectiveCharge)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Manual Mode: GAM/TAM Sliders */}
                  {allocationMode === 'manual' && (
                    <div className="mt-2 space-y-1.5">
                      {/* GAM Slider */}
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400 w-8 shrink-0">GAM</span>
                        <input
                          id={`gam-slider-${player.id}`}
                          type="range"
                          min={0}
                          max={trueCharge}
                          step={10000}
                          value={gamApplied}
                          onChange={(e) => onAllocationChange?.(player.id, 'gam', Number(e.target.value))}
                          disabled={tamApplied > 0}
                          className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer bg-purple-900/30 accent-purple-500 disabled:opacity-30"
                        />
                        <span className="text-purple-400 font-mono w-12 text-right">{formatSalary(gamApplied)}</span>
                      </div>
                      
                      {/* TAM Slider - only for eligible players */}
                      {tamEligible && (
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400 w-8 shrink-0">TAM</span>
                          <input
                            id={`tam-slider-${player.id}`}
                            type="range"
                            min={0}
                            max={Math.min(allocationMoney.TAM.maxBuydownPerPlayer, trueCharge)}
                            step={10000}
                            value={tamApplied}
                            onChange={(e) => onAllocationChange?.(player.id, 'tam', Number(e.target.value))}
                            disabled={gamApplied > 0}
                            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer bg-blue-900/30 accent-blue-500 disabled:opacity-30"
                          />
                          <span className="text-blue-400 font-mono w-12 text-right">{formatSalary(tamApplied)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export function RosterOverview() {
  const [showValues, setShowValues] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [showAllocation, setShowAllocation] = useState(false);
  
  // Use shared allocation context
  const { 
    allocationMode, 
    setAllocationMode, 
    currentAllocation, 
    handleAllocationChange, 
    resetToAuto 
  } = useAllocation();
  
  // Calculate totals from context
  const totalTAM = AUSTIN_FC_2026_ALLOCATION_POSITION.tam.annualAllocation;
  const totalGAM = AUSTIN_FC_2026_ALLOCATION_POSITION.gam.available2026;
  const tamUsed = currentAllocation.tamUsed;
  const gamUsed = currentAllocation.gamUsed;
  
  // Get compliance from context
  const isCompliant = currentAllocation.isCompliant;
  const shortfall = currentAllocation.totalBuydownNeeded - currentAllocation.totalBuydownApplied;
  
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
      {/* Header - responsive wrapping */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-3 sm:px-4 py-2 sm:py-3 border-b border-[var(--obsidian-lighter)]">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <h2 className="font-display text-base sm:text-lg text-white tracking-wide">ROSTER</h2>
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
            <span className="text-xs text-white/50 hidden sm:inline">
              showing <span className={filterTags.find(t => t.key === activeFilter)?.color}>{activeFilter}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* GAM/TAM Distribution Toggle */}
          <button
            onClick={() => setShowAllocation(!showAllocation)}
            className={`flex items-center gap-1.5 text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-md transition-colors ${
              showAllocation 
                ? 'bg-[var(--verde)] text-black font-semibold' 
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Sliders className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">{showAllocation ? 'Hide' : 'Show'} GAM/TAM</span>
            <span className="sm:hidden">GAM/TAM</span>
          </button>
          <button
            onClick={() => setShowValues(!showValues)}
            className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-md bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            {showValues ? 'Salary' : 'Value'}
          </button>
        </div>
      </div>

      {/* Allocation Mode Bar (when showAllocation is true) - responsive */}
      {showAllocation && (
        <div className="px-2 sm:px-4 py-2 border-b border-[var(--obsidian-lighter)] bg-[var(--obsidian)]/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            {/* Mode Toggle + Pool Status Row */}
            <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4 flex-wrap">
              {/* Mode Toggle */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 sm:gap-1 p-0.5 bg-[var(--obsidian)] rounded-md">
                  <button
                    onClick={() => setAllocationMode('auto')}
                    className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded text-[9px] sm:text-[10px] font-medium transition-all ${
                      allocationMode === 'auto' 
                        ? 'bg-[var(--verde)] text-black' 
                        : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    Auto
                  </button>
                  <button
                    onClick={() => setAllocationMode('manual')}
                    className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded text-[9px] sm:text-[10px] font-medium transition-all ${
                      allocationMode === 'manual' 
                        ? 'bg-[var(--verde)] text-black' 
                        : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    <Hand className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    Manual
                  </button>
                </div>
                
                {allocationMode === 'manual' && (
                  <button
                    onClick={resetToAuto}
                    className="text-[8px] sm:text-[9px] text-white/40 hover:text-white/60 underline"
                  >
                    Reset
                  </button>
                )}
              </div>
              
              {/* Pool Status - Compact on mobile */}
              <div className="flex items-center gap-2 sm:gap-3 text-[8px] sm:text-[9px]">
                <div className="flex items-center gap-1">
                  <span className="text-blue-400">TAM:</span>
                  <span className="text-white font-mono">{formatSalary(tamUsed)}</span>
                  <span className="text-white/30 hidden sm:inline">/ {formatSalary(totalTAM)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-purple-400">GAM:</span>
                  <span className="text-white font-mono">{formatSalary(gamUsed)}</span>
                  <span className="text-white/30 hidden sm:inline">/ {formatSalary(totalGAM)}</span>
                </div>
              </div>
            </div>
            
            {/* Compliance Status */}
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[9px] sm:text-[10px] font-medium self-start sm:self-auto ${
              isCompliant 
                ? 'bg-green-500/10 text-green-400' 
                : 'bg-red-500/10 text-red-400'
            }`}>
              {isCompliant ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="hidden sm:inline">COMPLIANT</span>
                  <span className="sm:hidden">OK</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  {formatSalary(shortfall)} SHORT
                </>
              )}
            </div>
          </div>
          
          {/* Rule Reminder - hidden on mobile */}
          <div className="hidden sm:flex items-center gap-1.5 mt-2 text-[9px] text-white/40">
            <Info className="w-3 h-3 text-blue-400 shrink-0" />
            <span>
              <span className="text-blue-400">TAM</span> only for players $803K-$1.8M • 
              Cannot mix TAM & GAM on same player • 
              TAM is use-it-or-lose-it
            </span>
          </div>
        </div>
      )}

      {/* Legend + Data Source Info - responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 border-b border-[var(--obsidian-lighter)]/50 text-[8px] sm:text-[9px]">
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
          {filterTags.map((tag) => {
            const isActive = activeFilter === tag.key;
            const count = austinFCRoster.filter(p => playerMatchesFilter(p, tag.key)).length;
            return (
              <button
                key={tag.key}
                onClick={() => setActiveFilter(isActive ? null : tag.key)}
                className={`px-1 sm:px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer hover:scale-105 ${tag.bgColor} ${tag.color} ${
                  isActive ? `ring-2 ${tag.activeRing} ring-offset-1 ring-offset-[var(--obsidian)]` : 'opacity-70 hover:opacity-100'
                }`}
                title={`${tag.label}: ${count} players`}
              >
                {tag.label}
                {isActive && <span className="ml-0.5 sm:ml-1 text-[7px] sm:text-[8px]">({count})</span>}
              </button>
            );
          })}
          {activeFilter && (
            <button
              onClick={() => setActiveFilter(null)}
              className="px-1 sm:px-1.5 py-0.5 rounded font-bold bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-0.5"
              title="Clear filter"
            >
              <X className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
        <div className="text-[7px] sm:text-[8px] text-white/40">
          {showValues ? (
            <span>📊{' '}
              <a 
                href="https://www.transfermarkt.us/austin-fc/startseite/verein/72309" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Transfermarkt
              </a>
              <span className="hidden sm:inline"> (Est. Jan 2026)</span>
            </span>
          ) : (
            <span>💰{' '}
              <a 
                href="https://mlsplayers.org/resources/salary-guide" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 underline"
              >
                MLSPA
              </a>
              <span className="hidden sm:inline"> (Oct 2025)</span>
            </span>
          )}
        </div>
      </div>

      {/* Roster Columns - responsive grid */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-1.5 sm:p-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2">
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
