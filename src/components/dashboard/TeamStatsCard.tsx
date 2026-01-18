'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useStandings } from '@/hooks/useLiveData';

const formColors: Record<string, string> = {
  W: 'bg-[var(--verde)]',
  D: 'bg-amber-500',
  L: 'bg-red-500',
};

export function TeamStatsCard() {
  const { standings, austinStanding, loading } = useStandings();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl border border-[var(--obsidian-lighter)] bg-[var(--obsidian-light)] h-[280px] flex items-center justify-center"
      >
        <Loader2 className="h-6 w-6 text-[var(--verde)] animate-spin" />
      </motion.div>
    );
  }

  // Fallback if Austin FC not found
  if (!austinStanding) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl border border-[var(--obsidian-lighter)] bg-[var(--obsidian-light)] p-4"
      >
        <p className="text-white/50 text-sm">Standings data unavailable</p>
      </motion.div>
    );
  }

  const { rank, team, points, goalsDiff, form, all } = austinStanding;
  const formArray = form ? form.slice(-5).split('') : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-xl border border-[var(--obsidian-lighter)] bg-[var(--obsidian-light)] overflow-hidden"
    >
      <div className="border-b border-[var(--obsidian-lighter)] px-4 py-3 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg text-white tracking-wide">STANDINGS</h2>
          <p className="text-xs text-white/50">2024 Western Conference</p>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 bg-[var(--verde)]/20 text-[var(--verde)] rounded">LIVE</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Team Logo & Position */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="font-display text-4xl text-[var(--verde)]">{rank}</p>
            <p className="text-xs text-white/50">Rank</p>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-2">
            <div className="text-center bg-[var(--obsidian)]/50 rounded-lg py-2">
              <p className="font-display text-xl text-[var(--verde)]">{all.win}</p>
              <p className="text-xs text-white/40">W</p>
            </div>
            <div className="text-center bg-[var(--obsidian)]/50 rounded-lg py-2">
              <p className="font-display text-xl text-amber-400">{all.draw}</p>
              <p className="text-xs text-white/40">D</p>
            </div>
            <div className="text-center bg-[var(--obsidian)]/50 rounded-lg py-2">
              <p className="font-display text-xl text-red-400">{all.lose}</p>
              <p className="text-xs text-white/40">L</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex justify-between text-sm py-2 border-y border-[var(--obsidian-lighter)]">
          <div className="text-center">
            <p className="font-semibold text-white">{points}</p>
            <p className="text-xs text-white/40">PTS</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-white">{all.goals.for}</p>
            <p className="text-xs text-white/40">GF</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-white">{all.goals.against}</p>
            <p className="text-xs text-white/40">GA</p>
          </div>
          <div className="text-center">
            <p className={`font-semibold ${goalsDiff >= 0 ? 'text-[var(--verde)]' : 'text-red-400'}`}>
              {goalsDiff > 0 ? '+' : ''}{goalsDiff}
            </p>
            <p className="text-xs text-white/40">GD</p>
          </div>
        </div>

        {/* Form */}
        {formArray.length > 0 && (
          <div>
            <p className="text-xs text-white/50 mb-2">Recent Form</p>
            <div className="flex gap-1.5">
              {formArray.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className={`h-7 w-7 rounded-md ${formColors[result] || 'bg-white/20'} flex items-center justify-center`}
                >
                  <span className="font-bold text-black text-xs">{result}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Games Played */}
        <div className="bg-gradient-to-r from-[var(--verde)]/10 to-transparent rounded-lg p-3 border border-[var(--verde)]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--verde)] mb-1">Season Progress</p>
              <p className="font-display text-lg text-white">{all.played} Matches Played</p>
              <p className="text-xs text-white/50">
                PPG: {(points / all.played).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
