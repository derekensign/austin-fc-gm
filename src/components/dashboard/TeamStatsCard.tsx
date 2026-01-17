'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { teamStats } from '@/data/roster';

const formColors: Record<string, string> = {
  W: 'bg-[var(--verde)]',
  D: 'bg-amber-500',
  L: 'bg-red-500',
};

export function TeamStatsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-xl border border-[var(--obsidian-lighter)] bg-[var(--obsidian-light)] overflow-hidden"
    >
      <div className="border-b border-[var(--obsidian-lighter)] px-4 py-3">
        <h2 className="font-display text-lg text-white tracking-wide">STANDINGS</h2>
        <p className="text-xs text-white/50">{teamStats.season} {teamStats.conference}</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Position & Record */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="font-display text-4xl text-[var(--verde)]">{teamStats.position}</p>
            <p className="text-xs text-white/50">Rank</p>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-2">
            <div className="text-center bg-[var(--obsidian)]/50 rounded-lg py-2">
              <p className="font-display text-xl text-[var(--verde)]">{teamStats.wins}</p>
              <p className="text-xs text-white/40">W</p>
            </div>
            <div className="text-center bg-[var(--obsidian)]/50 rounded-lg py-2">
              <p className="font-display text-xl text-amber-400">{teamStats.draws}</p>
              <p className="text-xs text-white/40">D</p>
            </div>
            <div className="text-center bg-[var(--obsidian)]/50 rounded-lg py-2">
              <p className="font-display text-xl text-red-400">{teamStats.losses}</p>
              <p className="text-xs text-white/40">L</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex justify-between text-sm py-2 border-y border-[var(--obsidian-lighter)]">
          <div className="text-center">
            <p className="font-semibold text-white">{teamStats.points}</p>
            <p className="text-xs text-white/40">PTS</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-white">{teamStats.goalsFor}</p>
            <p className="text-xs text-white/40">GF</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-white">{teamStats.goalsAgainst}</p>
            <p className="text-xs text-white/40">GA</p>
          </div>
          <div className="text-center">
            <p className={`font-semibold ${teamStats.goalDifference >= 0 ? 'text-[var(--verde)]' : 'text-red-400'}`}>
              {teamStats.goalDifference > 0 ? '+' : ''}{teamStats.goalDifference}
            </p>
            <p className="text-xs text-white/40">GD</p>
          </div>
        </div>

        {/* Form */}
        <div>
          <p className="text-xs text-white/50 mb-2">Recent Form</p>
          <div className="flex gap-1.5">
            {teamStats.form.map((result, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`h-7 w-7 rounded-md ${formColors[result]} flex items-center justify-center`}
              >
                <span className="font-bold text-black text-xs">{result}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Next Match */}
        <div className="bg-gradient-to-r from-[var(--verde)]/10 to-transparent rounded-lg p-3 border border-[var(--verde)]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--verde)] mb-1">Next Match</p>
              <p className="font-display text-lg text-white">{teamStats.nextMatch.opponent}</p>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <Calendar className="h-3 w-3" />
                {new Date(teamStats.nextMatch.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-bold ${teamStats.nextMatch.isHome ? 'bg-[var(--verde)] text-black' : 'bg-white/10 text-white'}`}>
              {teamStats.nextMatch.isHome ? 'HOME' : 'AWAY'}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
