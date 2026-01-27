'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { type TacticsSettings } from '@/context/LineupContext';

interface TacticalOverlaysProps {
  tactics: TacticsSettings;
  enabled?: boolean;
}

/**
 * Tactical overlays component
 * Shows defensive line, pressing zones, and other tactical visualizations
 */
export function TacticalOverlays({ tactics, enabled = true }: TacticalOverlaysProps) {
  if (!enabled) return null;

  const { defensiveLineHeight, teamWidth, pressingIntensity } = tactics;

  // Calculate defensive line position (0-100%)
  // Base at 15%, range up to 50% (0 = 15%, 100 = 50%)
  const defensiveLineY = 15 + (defensiveLineHeight * 0.35);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Defensive Line */}
        {defensiveLineHeight > 0 && (
          <motion.line
            initial={{ y1: 15, y2: 15 }}
            animate={{ y1: defensiveLineY, y2: defensiveLineY }}
            transition={{ duration: 0.3 }}
            x1="10"
            x2="90"
            className="stroke-blue-400"
            strokeWidth="0.5"
            strokeDasharray="2,2"
            opacity={0.6}
          />
        )}

        {/* Pressing Zones */}
        {pressingIntensity > 20 && (
          <>
            {/* High press zone (opponent's half) */}
            <motion.rect
              initial={{ opacity: 0 }}
              animate={{ opacity: pressingIntensity / 300 }}
              transition={{ duration: 0.3 }}
              x="10"
              y="70"
              width="80"
              height="25"
              className="fill-red-500"
            />

            {/* Mid press zone */}
            {pressingIntensity > 50 && (
              <motion.rect
                initial={{ opacity: 0 }}
                animate={{ opacity: (pressingIntensity - 50) / 400 }}
                transition={{ duration: 0.3 }}
                x="10"
                y="50"
                width="80"
                height="20"
                className="fill-red-500"
              />
            )}
          </>
        )}

        {/* Team Width Indicators */}
        {teamWidth !== 50 && (
          <>
            {/* Left width marker */}
            <motion.line
              initial={{ x1: 25, x2: 25 }}
              animate={{
                x1: 50 - (teamWidth * 0.4),
                x2: 50 - (teamWidth * 0.4)
              }}
              transition={{ duration: 0.3 }}
              y1="20"
              y2="80"
              className="stroke-green-400"
              strokeWidth="0.3"
              strokeDasharray="1,1"
              opacity={0.3}
            />

            {/* Right width marker */}
            <motion.line
              initial={{ x1: 75, x2: 75 }}
              animate={{
                x1: 50 + (teamWidth * 0.4),
                x2: 50 + (teamWidth * 0.4)
              }}
              transition={{ duration: 0.3 }}
              y1="20"
              y2="80"
              className="stroke-green-400"
              strokeWidth="0.3"
              strokeDasharray="1,1"
              opacity={0.3}
            />
          </>
        )}
      </svg>
    </div>
  );
}
