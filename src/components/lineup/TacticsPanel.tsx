'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLineup } from '@/context/LineupContext';

/**
 * Tactics panel with sliders for team tactics
 */
export function TacticsPanel() {
  const { lineupState, updateTactics } = useLineup();
  const { tactics } = lineupState;

  const handleSliderChange = (key: keyof typeof tactics, value: number) => {
    updateTactics({ [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* Defensive Line Height */}
      <TacticsSlider
        label="Defensive Line"
        value={tactics.defensiveLineHeight}
        onChange={(value) => handleSliderChange('defensiveLineHeight', value)}
        lowLabel="Deep"
        highLabel="High"
        color="blue"
      />

      {/* Team Width */}
      <TacticsSlider
        label="Team Width"
        value={tactics.teamWidth}
        onChange={(value) => handleSliderChange('teamWidth', value)}
        lowLabel="Narrow"
        highLabel="Wide"
        color="green"
      />

      {/* Pressing Intensity */}
      <TacticsSlider
        label="Pressing"
        value={tactics.pressingIntensity}
        onChange={(value) => handleSliderChange('pressingIntensity', value)}
        lowLabel="Low"
        highLabel="High"
        color="red"
      />
    </div>
  );
}

/**
 * Individual tactics slider component
 */
interface TacticsSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  lowLabel: string;
  highLabel: string;
  color: 'blue' | 'green' | 'red';
}

function TacticsSlider({
  label,
  value,
  onChange,
  lowLabel,
  highLabel,
  color,
}: TacticsSliderProps) {
  const colorClasses = {
    blue: {
      track: 'bg-blue-500',
      thumb: 'bg-blue-500 border-blue-400',
      text: 'text-blue-400',
    },
    green: {
      track: 'bg-[var(--verde)]',
      thumb: 'bg-[var(--verde)] border-[var(--verde)]',
      text: 'text-[var(--verde)]',
    },
    red: {
      track: 'bg-red-500',
      thumb: 'bg-red-500 border-red-400',
      text: 'text-red-400',
    },
  };

  const colors = colorClasses[color];

  return (
    <div>
      {/* Label and Value */}
      <div className="flex items-center justify-between mb-2">
        <label className="text-white text-sm font-medium">{label}</label>
        <span className={`text-sm font-bold ${colors.text}`}>
          {value}
        </span>
      </div>

      {/* Slider */}
      <div className="relative">
        {/* Track */}
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          {/* Filled portion */}
          <motion.div
            className={`h-full ${colors.track}`}
            initial={false}
            animate={{ width: `${value}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>

        {/* Thumb */}
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
        />

        <motion.div
          className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 ${colors.thumb} shadow-lg pointer-events-none`}
          initial={false}
          animate={{ left: `calc(${value}% - 8px)` }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-white/50">{lowLabel}</span>
        <span className="text-xs text-white/50">{highLabel}</span>
      </div>
    </div>
  );
}
