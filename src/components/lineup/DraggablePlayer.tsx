'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { type AustinFCPlayer } from '@/data/austin-fc-roster';
import { type PlayerPosition } from '@/context/LineupContext';
import { useLineup } from '@/context/LineupContext';

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
  const { removeFromLineup } = useLineup();
  const [isFirstRender, setIsFirstRender] = useState(true);

  // Skip animation on first render
  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromLineup(player.id);
  };

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

    const unconstrained = {
      x: position.x + deltaXPercent,
      y: position.y + deltaYPercent,
    };

    // Check if dropped on bench area
    const draggedElement = _event.target as HTMLElement;
    const draggedRect = draggedElement.getBoundingClientRect();
    const dragCenterX = draggedRect.left + draggedRect.width / 2;
    const dragCenterY = draggedRect.top + draggedRect.height / 2;

    const benchElement = document.querySelector('[data-bench-container]');
    if (benchElement) {
      const benchRect = benchElement.getBoundingClientRect();
      if (
        dragCenterX >= benchRect.left &&
        dragCenterX <= benchRect.right &&
        dragCenterY >= benchRect.top &&
        dragCenterY <= benchRect.bottom
      ) {
        removeFromLineup(player.id);
        return;
      }
    }

    // Check if dragged outside field boundaries (remove from lineup)
    if (unconstrained.x < 6 || unconstrained.x > 94 || unconstrained.y < 6 || unconstrained.y > 94) {
      removeFromLineup(player.id);
      return;
    }

    // Otherwise, update position (constrained to field boundaries)
    const newX = Math.max(6, Math.min(94, unconstrained.x));
    const newY = Math.max(6, Math.min(94, unconstrained.y));

    onDragEnd({
      ...position,
      x: newX,
      y: newY,
    });
  };

  // Position color mapping - text color only, no background
  const positionColors: Record<string, string> = {
    GK: 'text-yellow-400 border-yellow-500/50',
    DEF: 'text-blue-400 border-blue-500/50',
    MID: 'text-green-400 border-green-500/50',
    FWD: 'text-red-400 border-red-500/50',
  };

  const positionColor = positionColors[player.positionGroup] || positionColors.DEF;

  return (
    <motion.div
      ref={containerRef}
      drag
      dragMomentum={false}
      dragElastic={0}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.1, zIndex: 1000 }}
      initial={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      animate={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      transition={isFirstRender ? { duration: 0 } : {
        type: 'tween',
        duration: 0.3,
        ease: 'easeOut',
      }}
      style={{ ...style, left: undefined, top: undefined }}
      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
      onClick={onClick}
    >
      {/* Player Node Container */}
      <div className="flex flex-col items-center gap-1 pointer-events-none select-none">
        {/* Player Last Name */}
        <div className="text-white text-xs font-bold text-center whitespace-nowrap bg-[var(--obsidian)]/50 px-2 py-0.5 rounded">
          {player.lastName}
        </div>

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
            {player.photo ? (
              <img
                src={player.photo}
                alt={player.name}
                className="w-full h-full object-cover pointer-events-none select-none"
                draggable={false}
                onError={(e) => {
                  // Fallback to initials if image fails
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  // Show initials fallback
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            {/* Fallback initials - only shown if image fails or missing */}
            <div
              className="absolute inset-0 items-center justify-center text-white font-bold text-lg"
              style={{ display: player.photo ? 'none' : 'flex' }}
            >
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

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="absolute -top-1 -left-1 bg-black/80 hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center transition-colors shadow-lg z-10 pointer-events-auto border border-white/30"
            title="Remove from lineup"
          >
            <X className="w-3 h-3 text-white" />
          </button>

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
          className={`px-2 py-0.5 rounded border ${positionColor} ${config.text} font-bold uppercase tracking-wide whitespace-nowrap`}
        >
          {position.role}
        </div>
      </div>
    </motion.div>
  );
}
