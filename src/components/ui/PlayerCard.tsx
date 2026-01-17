'use client';

import { motion } from 'framer-motion';

interface PlayerCardProps {
  name: string;
  position: string;
  number: number;
  nationality: string;
  age: number;
  salary: string;
  designation?: 'DP' | 'TAM' | 'U22' | 'GA' | 'HG';
  stats?: {
    goals?: number;
    assists?: number;
    minutes?: number;
  };
  imageUrl?: string;
  delay?: number;
}

const designationColors: Record<string, string> = {
  DP: 'bg-gradient-to-r from-amber-500 to-amber-600 text-black',
  TAM: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
  U22: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
  GA: 'bg-gradient-to-r from-[var(--verde)] to-[var(--verde-dark)] text-black',
  HG: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
};

export function PlayerCard({
  name,
  position,
  number,
  nationality,
  age,
  salary,
  designation,
  stats,
  delay = 0,
}: PlayerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="stat-card rounded-xl overflow-hidden group"
    >
      {/* Header with number and position */}
      <div className="relative h-24 bg-gradient-to-br from-[var(--obsidian-lighter)] to-[var(--obsidian)] flex items-center justify-between px-4">
        <span className="font-display text-6xl text-white/10 group-hover:text-[var(--verde)]/20 transition-colors">
          {number}
        </span>
        <div className="text-right">
          <span className="badge-verde text-xs">{position}</span>
        </div>
        {/* Verde accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--verde)] via-[var(--verde)]/50 to-transparent" />
      </div>

      {/* Player Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-display text-xl text-white tracking-wide">{name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-white/60">{nationality}</span>
            <span className="text-white/30">•</span>
            <span className="text-sm text-white/60">{age} yrs</span>
          </div>
        </div>

        {/* Designation Badge */}
        {designation && (
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${designationColors[designation]}`}>
            {designation}
          </span>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-[var(--obsidian-lighter)]">
            {stats.goals !== undefined && (
              <div className="text-center">
                <p className="font-display text-2xl text-white">{stats.goals}</p>
                <p className="text-xs text-white/50 uppercase tracking-wider">Goals</p>
              </div>
            )}
            {stats.assists !== undefined && (
              <div className="text-center">
                <p className="font-display text-2xl text-white">{stats.assists}</p>
                <p className="text-xs text-white/50 uppercase tracking-wider">Assists</p>
              </div>
            )}
            {stats.minutes !== undefined && (
              <div className="text-center">
                <p className="font-display text-2xl text-white">{stats.minutes}</p>
                <p className="text-xs text-white/50 uppercase tracking-wider">Mins</p>
              </div>
            )}
          </div>
        )}

        {/* Salary */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/50">Salary</span>
          <span className="font-semibold text-[var(--verde)]">{salary}</span>
        </div>
      </div>
    </motion.div>
  );
}

