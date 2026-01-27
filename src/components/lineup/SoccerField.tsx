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
 * SVG-based soccer field component
 * Standard dimensions: 105m x 68m aspect ratio
 * Coordinates: 0-100 (percentage-based for responsive positioning)
 */
export function SoccerField({
  children,
  className = '',
  tactics,
  showOverlays = true
}: SoccerFieldProps) {
  // SVG dimensions - portrait orientation for lineup view (68 wide x 105 tall)
  const width = 100;
  const height = 100;

  // Field markings dimensions (percentage-based for 0-100 coordinate system)
  const penaltyBoxWidth = 40;  // Width of penalty box (centered)
  const penaltyBoxDepth = 16; // Depth from goal line
  const goalBoxWidth = 18;   // Width of goal box (centered)
  const goalBoxDepth = 6;     // Depth from goal line
  const centerCircleRadius = 9;
  const penaltySpotDistance = 11; // Distance from goal line

  return (
    <div className={`relative w-full h-full ${className}`} id="lineup-field">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Field Background */}
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          className="fill-green-800"
        />

        {/* Grass Pattern (subtle stripes) */}
        <defs>
          <pattern
            id="grass-stripes"
            x="0"
            y="0"
            width="10"
            height={height}
            patternUnits="userSpaceOnUse"
          >
            <rect x="0" y="0" width="5" height={height} className="fill-green-800" />
            <rect x="5" y="0" width="5" height={height} className="fill-green-900" />
          </pattern>
        </defs>
        <rect x="0" y="0" width={width} height={height} fill="url(#grass-stripes)" opacity="0.3" />

        {/* Field Markings - All lines in verde color */}
        <g className="stroke-[var(--verde)]" strokeWidth="0.3" fill="none">
          {/* Outer boundary */}
          <rect x="1" y="1" width={width - 2} height={height - 2} />

          {/* Halfway line */}
          <line
            x1={width / 2}
            y1="1"
            x2={width / 2}
            y2={height - 1}
          />

          {/* Center circle */}
          <circle
            cx={width / 2}
            cy={height / 2}
            r={centerCircleRadius}
          />

          {/* Center spot */}
          <circle
            cx={width / 2}
            cy={height / 2}
            r="0.4"
            className="fill-[var(--verde)]"
          />

          {/* Top penalty box (attacking end - opponent's goal) */}
          <rect
            x={(width - penaltyBoxWidth) / 2}
            y="2"
            width={penaltyBoxWidth}
            height={penaltyBoxDepth}
          />

          {/* Top goal box */}
          <rect
            x={(width - goalBoxWidth) / 2}
            y="2"
            width={goalBoxWidth}
            height={goalBoxDepth}
          />

          {/* Top penalty spot */}
          <circle
            cx={width / 2}
            cy={2 + penaltySpotDistance}
            r="0.5"
            className="fill-[var(--verde)]"
          />

          {/* Top penalty arc */}
          <path
            d={`M ${(width - penaltyBoxWidth) / 2} ${2 + penaltyBoxDepth}
                A ${centerCircleRadius} ${centerCircleRadius} 0 0 0 ${(width + penaltyBoxWidth) / 2} ${2 + penaltyBoxDepth}`}
          />

          {/* Bottom penalty box (defensive end - our goal where GK is) */}
          <rect
            x={(width - penaltyBoxWidth) / 2}
            y={height - penaltyBoxDepth - 2}
            width={penaltyBoxWidth}
            height={penaltyBoxDepth}
          />

          {/* Bottom goal box */}
          <rect
            x={(width - goalBoxWidth) / 2}
            y={height - goalBoxDepth - 2}
            width={goalBoxWidth}
            height={goalBoxDepth}
          />

          {/* Bottom penalty spot */}
          <circle
            cx={width / 2}
            cy={height - penaltySpotDistance - 2}
            r="0.5"
            className="fill-[var(--verde)]"
          />

          {/* Bottom penalty arc */}
          <path
            d={`M ${(width - penaltyBoxWidth) / 2} ${height - penaltyBoxDepth - 2}
                A ${centerCircleRadius} ${centerCircleRadius} 0 0 1 ${(width + penaltyBoxWidth) / 2} ${height - penaltyBoxDepth - 2}`}
          />

          {/* Corner arcs */}
          {/* Bottom-left */}
          <path d="M 1 2 A 1 1 0 0 1 2 1" />
          {/* Bottom-right */}
          <path d={`M ${width - 2} 1 A 1 1 0 0 1 ${width - 1} 2`} />
          {/* Top-left */}
          <path d={`M 1 ${height - 2} A 1 1 0 0 0 2 ${height - 1}`} />
          {/* Top-right */}
          <path d={`M ${width - 2} ${height - 1} A 1 1 0 0 0 ${width - 1} ${height - 2}`} />
        </g>

        {/* Goals */}
        <g className="stroke-white" strokeWidth="0.4" fill="none">
          {/* Bottom goal */}
          <rect
            x={(width - 7.32) / 2}
            y="-1.5"
            width="7.32"
            height="1.5"
          />
          {/* Top goal */}
          <rect
            x={(width - 7.32) / 2}
            y={height}
            width="7.32"
            height="1.5"
          />
        </g>
      </svg>

      {/* Tactical overlays layer */}
      {tactics && showOverlays && (
        <TacticalOverlays tactics={tactics} enabled={showOverlays} />
      )}

      {/* Player positioning layer (percentage-based) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full pointer-events-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
