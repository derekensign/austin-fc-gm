'use client';

import { motion } from 'framer-motion';
import { roster, getPlayersByPosition } from '@/data/roster';

const positionGroups = [
  { key: 'GK', label: 'GK', bgColor: 'bg-yellow-500/10', borderColor: 'border-l-yellow-500' },
  { key: 'DEF', label: 'DEF', bgColor: 'bg-blue-500/10', borderColor: 'border-l-blue-500' },
  { key: 'MID', label: 'MID', bgColor: 'bg-[var(--verde)]/10', borderColor: 'border-l-[var(--verde)]' },
  { key: 'FWD', label: 'FWD', bgColor: 'bg-red-500/10', borderColor: 'border-l-red-500' },
] as const;

export function RosterOverview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-xl border border-[var(--obsidian-lighter)] bg-[var(--obsidian-light)] h-full flex flex-col"
    >
      <div className="border-b border-[var(--obsidian-lighter)] px-4 py-3 flex-shrink-0">
        <h2 className="font-display text-lg md:text-xl text-white tracking-wide">ROSTER OVERVIEW</h2>
        <p className="text-xs text-white/50">{roster.length} players</p>
      </div>

      <div className="p-3 md:p-4 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-3 md:gap-4">
          {positionGroups.map((group, groupIndex) => {
            const players = getPlayersByPosition(group.key);
            return (
              <motion.div
                key={group.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + groupIndex * 0.1 }}
                className="space-y-1.5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge-verde text-xs">{group.label}</span>
                  <span className="text-xs text-white/40">{players.length}</span>
                </div>

                {players.map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-2 p-2 rounded-lg ${group.bgColor} border-l-2 ${group.borderColor} hover:border-l-[var(--verde)] transition-colors cursor-pointer`}
                  >
                    <div className="w-6 h-6 rounded-full bg-[var(--obsidian)] flex items-center justify-center text-xs text-white/60 font-display flex-shrink-0">
                      {player.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-white leading-tight truncate">{player.name}</p>
                      <p className="text-[10px] text-white/40 leading-tight hidden sm:block">{player.nationality}</p>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                      <span className="text-xs font-semibold text-[var(--verde)]">{player.salaryFormatted}</span>
                      {player.designation && (
                        <span className="text-[10px] text-white/30 bg-white/5 px-1 rounded hidden md:inline">{player.designation}</span>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
