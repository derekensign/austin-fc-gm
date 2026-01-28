'use client';

import React from 'react';
import { TacticalOverlays } from './TacticalOverlays';
import { type TacticsSettings } from '@/context/LineupContext';

interface SoccerFieldProps {
  children?: React.ReactNode;
  className?: string;
  tactics?: TacticsSettings;
  showOverlays?: boolean;
}

/**
 * Simple image-based soccer field component
 * Drop any soccer field image as /public/soccer-field.png and it will be used
 */
export function SoccerField({
  children,
  className = '',
  tactics,
  showOverlays = true
}: SoccerFieldProps) {
  return (
    <div className={`relative w-full h-full ${className}`} id="lineup-field">
      {/* Field background image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/soccer-field.png)',
          backgroundColor: '#1a5f3a' // Fallback green if no image
        }}
      />

      {/* Tactical overlays layer */}
      {tactics && showOverlays && (
        <TacticalOverlays tactics={tactics} enabled={showOverlays} />
      )}

      {/* Player positioning layer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full pointer-events-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
