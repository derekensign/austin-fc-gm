'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
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
          <span className="text-xs px-2 py-1 bg-[var(--verde)] text-black rounded font-bold">
            {totalPlayers}
          </span>
        </div>
        <button
          onClick={() => setShowValues(!showValues)}
          className="text-xs px-3 py-1.5 rounded-md bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          {showValues ? 'Show Salary' : 'Show Value'}
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[var(--obsidian-lighter)]/50 text-[9px] flex-wrap">
        <span className="px-1.5 py-0.5 rounded font-bold bg-amber-500/20 text-amber-400">DP</span>
        <span className="px-1.5 py-0.5 rounded font-bold bg-blue-500/20 text-blue-400">TAM</span>
        <span className="px-1.5 py-0.5 rounded font-bold bg-purple-500/20 text-purple-400">U22</span>
        <span className="px-1.5 py-0.5 rounded font-bold bg-orange-500/20 text-orange-400">INT</span>
        <span className="px-1.5 py-0.5 rounded font-bold bg-green-500/20 text-green-400">HG</span>
        <span className="px-1.5 py-0.5 rounded font-bold bg-slate-500/20 text-slate-300">SR</span>
        <span className="px-1.5 py-0.5 rounded font-bold bg-pink-500/20 text-pink-400">SUP</span>
        <span className="px-1.5 py-0.5 rounded font-bold bg-cyan-500/20 text-cyan-400">GA</span>
      </div>

      {/* Roster Columns */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
          {positionGroups.map((group, groupIndex) => {
            const players = getPlayersByPosition(group.key);
            return (
              <motion.div
                key={group.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + groupIndex * 0.05 }}
                className={`rounded-lg bg-[#0a0a0a] border-l-2 ${group.borderColor} overflow-hidden`}
              >
                {/* Section Header */}
                <div className="flex items-center justify-between px-3 py-2 bg-white/[0.02]">
                  <span className={`text-xs font-bold tracking-wide ${group.textColor}`}>
                    {group.label}
                  </span>
                  <span className="text-[10px] text-white/30">
                    {players.length}
                  </span>
                </div>
                
                {/* Player List */}
                <div>
                  {players.map((player) => (
                    <PlayerRow 
                      key={player.id} 
                      player={player}
                      showValues={showValues}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
