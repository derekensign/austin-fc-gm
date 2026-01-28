'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { austinFCRoster, type AustinFCPlayer } from '@/data/austin-fc-roster';
import { useLineup } from '@/context/LineupContext';

interface PlayerBenchProps {
  onPlayerSelect?: (playerId: number) => void;
}

/**
 * Player bench component showing available players grouped by position
 */
export function PlayerBench({ onPlayerSelect }: PlayerBenchProps) {
  const { lineupState, addToLineup, removeFromLineup } = useLineup();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPosition, setFilterPosition] = useState<string>('all');

  // Get players for bench
  const benchPlayers = austinFCRoster.filter(p =>
    lineupState.bench.includes(p.id)
  );

  // Get starting XI players
  const startingPlayers = austinFCRoster.filter(p =>
    lineupState.startingXI.includes(p.id)
  );

  // Filter players based on search and position
  const filteredBench = benchPlayers.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = filterPosition === 'all' || p.positionGroup === filterPosition;
    return matchesSearch && matchesPosition;
  });

  // Group by position
  const groupedPlayers = {
    GK: filteredBench.filter(p => p.positionGroup === 'GK'),
    DEF: filteredBench.filter(p => p.positionGroup === 'DEF'),
    MID: filteredBench.filter(p => p.positionGroup === 'MID'),
    FWD: filteredBench.filter(p => p.positionGroup === 'FWD'),
  };

  // Position colors
  const positionColors: Record<string, string> = {
    GK: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    DEF: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    MID: 'bg-green-500/20 text-green-400 border-green-500/30',
    FWD: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const handlePlayerClick = (player: AustinFCPlayer) => {
    if (lineupState.startingXI.includes(player.id)) {
      removeFromLineup(player.id);
    } else if (lineupState.startingXI.length < 11) {
      addToLineup(player.id);
      onPlayerSelect?.(player.id);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header with counter */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-sm text-white">
            Starting XI: <span className="text-[var(--verde)]">{lineupState.startingXI.length}/11</span>
          </h3>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search players..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-3 py-2 bg-[var(--obsidian)] border border-[var(--obsidian-lighter)] rounded-lg text-white text-sm placeholder:text-white/40 focus:border-[var(--verde)] focus:outline-none"
      />

      {/* Position Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'GK', 'DEF', 'MID', 'FWD'].map((pos) => (
          <button
            key={pos}
            onClick={() => setFilterPosition(pos)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase whitespace-nowrap transition-colors ${
              filterPosition === pos
                ? 'bg-[var(--verde)] text-black'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {pos === 'all' ? 'All' : pos}
          </button>
        ))}
      </div>

      {/* Starting XI */}
      {startingPlayers.length > 0 && (
        <div>
          <h4 className="text-xs text-white/60 uppercase tracking-wider mb-2">On Field</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {startingPlayers.map((player) => (
              <PlayerRow
                key={player.id}
                player={player}
                isOnField={true}
                onClick={() => handlePlayerClick(player)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bench Players by Position */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {Object.entries(groupedPlayers).map(([posGroup, players]) => {
          if (players.length === 0) return null;

          return (
            <div key={posGroup}>
              <h4 className="text-xs text-white/60 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded border ${positionColors[posGroup]}`}
                >
                  {posGroup}
                </span>
                <span>({players.length})</span>
              </h4>
              <div className="space-y-1">
                {players.map((player) => (
                  <PlayerRow
                    key={player.id}
                    player={player}
                    isOnField={false}
                    onClick={() => handlePlayerClick(player)}
                    disabled={false}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredBench.length === 0 && (
        <div className="text-center py-8 text-white/40 text-sm">
          No players found
        </div>
      )}
    </div>
  );
}

/**
 * Individual player row component
 */
function PlayerRow({
  player,
  isOnField,
  onClick,
  disabled = false,
}: {
  player: AustinFCPlayer;
  isOnField: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 p-2 rounded-lg border transition-all ${
        isOnField
          ? 'bg-[var(--verde)]/10 border-[var(--verde)]/30 hover:bg-[var(--verde)]/20'
          : disabled
          ? 'bg-white/5 border-white/10 opacity-50 cursor-not-allowed'
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-[var(--verde)]/30'
      }`}
    >
      {/* Player Photo */}
      <div className="relative flex-shrink-0">
        <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${
          isOnField
            ? 'border-[var(--verde)] bg-[var(--obsidian-light)]'
            : 'border-white/30 bg-[var(--obsidian-light)]'
        }`}>
          {player.photo ? (
            <img
              src={player.photo}
              alt={player.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : null}
          {/* Fallback initials - only shown if image fails or missing */}
          <div
            className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold bg-black/60"
            style={{ display: player.photo ? 'none' : 'flex' }}
          >
            {player.firstName[0]}{player.lastName[0]}
          </div>
        </div>
        {player.number && (
          <div className="absolute -top-0.5 -right-0.5 bg-[var(--obsidian)] border border-[var(--verde)] rounded-full w-5 h-5 flex items-center justify-center">
            <span className="text-[9px] font-bold text-[var(--verde)]">
              {player.number}
            </span>
          </div>
        )}
      </div>

      {/* Player Info */}
      <div className="flex-1 min-w-0 text-left">
        <p className="text-white text-sm font-medium truncate">
          {player.name}
        </p>
        <p className="text-white/60 text-xs">
          {player.position}
        </p>
      </div>

      {/* Designation Badge */}
      {player.designation && ['DP', 'U22', 'GA'].includes(player.designation) && (
        <div
          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
            player.designation === 'DP'
              ? 'bg-amber-500 text-black'
              : player.designation === 'U22'
              ? 'bg-purple-500 text-white'
              : 'bg-[var(--verde)] text-black'
          }`}
        >
          {player.designation}
        </div>
      )}

      {/* Add/Remove Icon */}
      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
        isOnField
          ? 'bg-red-500/20 text-red-400'
          : 'bg-[var(--verde)]/20 text-[var(--verde)]'
      }`}>
        {isOnField ? (
          <X className="w-4 h-4" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </div>
    </motion.button>
  );
}
