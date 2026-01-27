'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { type AustinFCPlayer } from '@/data/austin-fc-roster';
import { type PlayerPosition } from '@/context/LineupContext';

interface DraggablePlayerProps {
  player: AustinFCPlayer;
  position: PlayerPosition;
  onDragEnd: (newPosition: PlayerPosition) => void;
  size?: 'small' | 'medium' | 'large';
  isSelected?: boolean;
  onClick?: () => void;
}

/**
 * Draggable player node for the lineup builder
 * Uses Framer Motion for drag gestures
 */
export function DraggablePlayer({
  player,
  position,
  onDragEnd,
  size = 'medium',
  isSelected = false,
  onClick,
}: DraggablePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Size configurations
  const sizeConfig = {
    small: { avatar: 32, text: 'text-[8px]' },
    medium: { avatar: 40, text: 'text-[10px]' },
    large: { avatar: 48, text: 'text-xs' },
  };

  const config = sizeConfig[size];

  // Convert percentage position to pixels for initial placement
  const style = {
    left: `${position.x}%`,
    top: `${position.y}%`,
    zIndex: position.depth + 10, // Base z-index of 10 for players
  };

  // Handle drag end - convert pixel delta to percentage
  const handleDragEnd = (_event: any, info: any) => {
    if (!containerRef.current?.parentElement) return;

    const parent = containerRef.current.parentElement;
    const parentRect = parent.getBoundingClientRect();

    // Calculate new percentage position
    const deltaXPercent = (info.offset.x / parentRect.width) * 100;
    const deltaYPercent = (info.offset.y / parentRect.height) * 100;

    const newX = Math.max(0, Math.min(100, position.x + deltaXPercent));
    const newY = Math.max(0, Math.min(100, position.y + deltaYPercent));

    onDragEnd({
      ...position,
      x: newX,
      y: newY,
    });
  };

  // Position color mapping
  const positionColors: Record<string, string> = {
    GK: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    DEF: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    MID: 'bg-green-500/20 text-green-400 border-green-500/50',
    FWD: 'bg-red-500/20 text-red-400 border-red-500/50',
  };

  const positionColor = positionColors[player.positionGroup] || positionColors.DEF;

  return (
    <motion.div
      ref={containerRef}
      drag
      dragMomentum={false}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      style={{ ...style, left: undefined, top: undefined }}
      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-move"
      onClick={onClick}
    >
      {/* Player Node Container */}
      <div className="flex flex-col items-center gap-1">
        {/* Avatar with Jersey Number */}
        <div className="relative group">
          <motion.div
            whileHover={{ y: -2 }}
            className={`rounded-full border-2 overflow-hidden ${
              isSelected
                ? 'border-[var(--verde)] shadow-[0_0_12px_var(--verde)]'
                : 'border-white/30 hover:border-[var(--verde)]'
            } bg-[var(--obsidian-light)] transition-all`}
            style={{ width: config.avatar, height: config.avatar }}
          >
            <img
              src={player.photo}
              alt={player.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to initials if image fails
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            {/* Fallback initials */}
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold bg-gradient-to-br from-[var(--verde)]/20 to-[var(--verde)]/40">
              {player.firstName[0]}{player.lastName[0]}
            </div>
          </motion.div>

          {/* Jersey Number Overlay */}
          {player.number && (
            <div
              className="absolute -top-1 -right-1 bg-[var(--obsidian)] border border-[var(--verde)] rounded-full w-5 h-5 flex items-center justify-center"
            >
              <span className="text-[9px] font-bold text-[var(--verde)]">
                {player.number}
              </span>
            </div>
          )}

          {/* Hover Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            <div className="bg-[var(--obsidian)] border border-[var(--obsidian-lighter)] rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
              <p className="text-white font-semibold text-sm">{player.name}</p>
              <p className="text-white/60 text-xs">
                {player.position} • Age {player.age}
              </p>
              {player.designation && (
                <p className="text-[var(--verde)] text-xs font-bold mt-1">
                  {player.designation}
                </p>
              )}
            </div>
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-[var(--obsidian-lighter)]" />
            </div>
          </div>
        </div>

        {/* Position Badge */}
        <div
          className={`px-2 py-0.5 rounded-full border ${positionColor} ${config.text} font-bold uppercase tracking-wide whitespace-nowrap`}
        >
          {position.role}
        </div>

        {/* Player Name (optional, for larger sizes) */}
        {size === 'large' && (
          <div className="text-white text-xs font-medium text-center max-w-[60px] truncate">
            {player.lastName}
          </div>
        )}
      </div>
    </motion.div>
  );
}
