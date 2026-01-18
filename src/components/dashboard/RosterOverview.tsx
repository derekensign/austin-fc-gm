'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';
import { 
  austinFCRoster, 
  getPlayersByPosition, 
  getFlag, 
  getDesignationBadge,
  formatSalary,
  type PositionGroup,
  type AustinFCPlayer 
} from '@/data/austin-fc-roster';

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
    case 'SUP': return player.rosterSlot === 'Supplemental';  // ALL supplemental players (including HG/GA)
    case 'GA': return player.isGenerationAdidas;
    default: return true;
  }
}

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

function PlayerRow({ player, showValues }: { player: AustinFCPlayer; showValues: boolean }) {
  const designation = getDesignationBadge(player);
  const flag = getFlag(player.nationality);
  
  // Check if player is supplemental but has a different primary designation (HG or GA)
  const isSupplementalWithOtherDesignation = player.rosterSlot === 'Supplemental' && 
    (player.isHomegrown || player.isGenerationAdidas) && 
    designation.label !== 'SUP';
  
  return (
    <div className="flex items-center gap-2.5 py-2 px-2.5 hover:bg-white/[0.03] border-b border-white/5 last:border-b-0">
      {/* Number */}
      <span className="w-5 text-[11px] text-white/30 font-mono text-center shrink-0">
        {player.number || '–'}
      </span>
      
      {/* Photo */}
      <PlayerAvatar player={player} />
      
      {/* Player Info - Two Lines */}
      <div className="flex-1 min-w-0">
        {/* Line 1: Name only */}
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
          {/* Show SUP badge for supplemental players who have another primary designation */}
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
      </div>
    </div>
  );
}

export function RosterOverview() {
  const [showValues, setShowValues] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  
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
        <button
          onClick={() => setShowValues(!showValues)}
          className="text-xs px-3 py-1.5 rounded-md bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          {showValues ? 'Show Salary' : 'Show Value'}
        </button>
      </div>

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
