/**
 * Formation presets for the lineup builder
 * Coordinates are percentages (0-100) where:
 * - x: 0 (left) to 100 (right)
 * - y: 0 (goalkeeper) to 100 (striker)
 */

export interface FormationPosition {
  role: string;              // 'GK', 'RB', 'CB', 'LB', 'CDM', 'CM', 'CAM', 'RW', 'LW', 'ST'
  x: number;                 // 0-100 (left to right)
  y: number;                 // 0-100 (bottom to top, GK=5, ST=95)
  depth: number;             // 0-10 for layering
  suggestedPlayerPosition: string; // 'GK', 'RB', 'CB', etc. for auto-fill
}

export interface FormationPreset {
  id: string;
  name: string;              // "4-3-3 Attack"
  shortName: string;         // "4-3-3"
  description: string;
  style: 'offensive' | 'balanced' | 'defensive';
  positions: FormationPosition[];
}

/**
 * 4-3-3 Formation - Austin FC's primary formation
 * Wide attacking wingers with a central striker
 */
export const formation433: FormationPreset = {
  id: '4-3-3',
  name: '4-3-3 Attack',
  shortName: '4-3-3',
  description: 'Austin FC\'s primary formation. Wide attacking wingers, central striker.',
  style: 'offensive',
  positions: [
    { role: 'GK',  x: 50, y: 5,  depth: 0, suggestedPlayerPosition: 'GK' },
    { role: 'RB',  x: 80, y: 20, depth: 1, suggestedPlayerPosition: 'RB' },
    { role: 'RCB', x: 62, y: 18, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'LCB', x: 38, y: 18, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'LB',  x: 20, y: 20, depth: 1, suggestedPlayerPosition: 'LB' },
    { role: 'RCM', x: 65, y: 50, depth: 2, suggestedPlayerPosition: 'CM' },
    { role: 'CM',  x: 50, y: 48, depth: 2, suggestedPlayerPosition: 'CM' },
    { role: 'LCM', x: 35, y: 50, depth: 2, suggestedPlayerPosition: 'CM' },
    { role: 'RW',  x: 78, y: 80, depth: 3, suggestedPlayerPosition: 'RW' },
    { role: 'ST',  x: 50, y: 90, depth: 3, suggestedPlayerPosition: 'ST' },
    { role: 'LW',  x: 22, y: 80, depth: 3, suggestedPlayerPosition: 'LW' },
  ]
};

/**
 * 4-2-3-1 Formation
 * Two defensive midfielders, attacking midfielder behind striker
 */
export const formation4231: FormationPreset = {
  id: '4-2-3-1',
  name: '4-2-3-1',
  shortName: '4-2-3-1',
  description: 'Defensive stability with two holding midfielders, attacking creativity through the CAM.',
  style: 'balanced',
  positions: [
    { role: 'GK',  x: 50, y: 5,  depth: 0, suggestedPlayerPosition: 'GK' },
    { role: 'RB',  x: 80, y: 20, depth: 1, suggestedPlayerPosition: 'RB' },
    { role: 'RCB', x: 62, y: 18, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'LCB', x: 38, y: 18, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'LB',  x: 20, y: 20, depth: 1, suggestedPlayerPosition: 'LB' },
    { role: 'RCDM', x: 60, y: 38, depth: 2, suggestedPlayerPosition: 'CDM' },
    { role: 'LCDM', x: 40, y: 38, depth: 2, suggestedPlayerPosition: 'CDM' },
    { role: 'RAM', x: 75, y: 65, depth: 3, suggestedPlayerPosition: 'RM' },
    { role: 'CAM', x: 50, y: 68, depth: 3, suggestedPlayerPosition: 'CAM' },
    { role: 'LAM', x: 25, y: 65, depth: 3, suggestedPlayerPosition: 'LM' },
    { role: 'ST',  x: 50, y: 90, depth: 4, suggestedPlayerPosition: 'ST' },
  ]
};

/**
 * 4-4-2 Formation
 * Classic balanced formation with two strikers
 */
export const formation442: FormationPreset = {
  id: '4-4-2',
  name: '4-4-2 Flat',
  shortName: '4-4-2',
  description: 'Classic formation with two strikers and a flat midfield four.',
  style: 'balanced',
  positions: [
    { role: 'GK',  x: 50, y: 5,  depth: 0, suggestedPlayerPosition: 'GK' },
    { role: 'RB',  x: 80, y: 20, depth: 1, suggestedPlayerPosition: 'RB' },
    { role: 'RCB', x: 62, y: 18, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'LCB', x: 38, y: 18, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'LB',  x: 20, y: 20, depth: 1, suggestedPlayerPosition: 'LB' },
    { role: 'RM',  x: 78, y: 50, depth: 2, suggestedPlayerPosition: 'RM' },
    { role: 'RCM', x: 60, y: 48, depth: 2, suggestedPlayerPosition: 'CM' },
    { role: 'LCM', x: 40, y: 48, depth: 2, suggestedPlayerPosition: 'CM' },
    { role: 'LM',  x: 22, y: 50, depth: 2, suggestedPlayerPosition: 'LM' },
    { role: 'RS',  x: 58, y: 88, depth: 3, suggestedPlayerPosition: 'ST' },
    { role: 'LS',  x: 42, y: 88, depth: 3, suggestedPlayerPosition: 'ST' },
  ]
};

/**
 * 5-3-2 Formation with wingbacks
 * Defensive solidity with attacking wingbacks
 */
export const formation532: FormationPreset = {
  id: '5-3-2',
  name: '5-3-2',
  shortName: '5-3-2',
  description: 'Three center-backs with attacking wingbacks providing width.',
  style: 'defensive',
  positions: [
    { role: 'GK',  x: 50, y: 5,  depth: 0, suggestedPlayerPosition: 'GK' },
    { role: 'RWB', x: 85, y: 28, depth: 1, suggestedPlayerPosition: 'RB' },
    { role: 'RCB', x: 65, y: 18, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'CB',  x: 50, y: 16, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'LCB', x: 35, y: 18, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'LWB', x: 15, y: 28, depth: 1, suggestedPlayerPosition: 'LB' },
    { role: 'RCM', x: 62, y: 52, depth: 2, suggestedPlayerPosition: 'CM' },
    { role: 'CM',  x: 50, y: 50, depth: 2, suggestedPlayerPosition: 'CM' },
    { role: 'LCM', x: 38, y: 52, depth: 2, suggestedPlayerPosition: 'CM' },
    { role: 'RS',  x: 58, y: 88, depth: 3, suggestedPlayerPosition: 'ST' },
    { role: 'LS',  x: 42, y: 88, depth: 3, suggestedPlayerPosition: 'ST' },
  ]
};

/**
 * 3-5-2 Formation
 * Three at the back with a packed midfield
 */
export const formation352: FormationPreset = {
  id: '3-5-2',
  name: '3-5-2',
  shortName: '3-5-2',
  description: 'Three center-backs with five midfielders controlling the center.',
  style: 'balanced',
  positions: [
    { role: 'GK',  x: 50, y: 5,  depth: 0, suggestedPlayerPosition: 'GK' },
    { role: 'RCB', x: 65, y: 18, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'CB',  x: 50, y: 16, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'LCB', x: 35, y: 18, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'RM',  x: 85, y: 52, depth: 2, suggestedPlayerPosition: 'RM' },
    { role: 'RCM', x: 62, y: 48, depth: 2, suggestedPlayerPosition: 'CM' },
    { role: 'CM',  x: 50, y: 46, depth: 2, suggestedPlayerPosition: 'CM' },
    { role: 'LCM', x: 38, y: 48, depth: 2, suggestedPlayerPosition: 'CM' },
    { role: 'LM',  x: 15, y: 52, depth: 2, suggestedPlayerPosition: 'LM' },
    { role: 'RS',  x: 58, y: 88, depth: 3, suggestedPlayerPosition: 'ST' },
    { role: 'LS',  x: 42, y: 88, depth: 3, suggestedPlayerPosition: 'ST' },
  ]
};

/**
 * 4-1-4-1 Formation (Diamond)
 * Narrow diamond midfield
 */
export const formation4141: FormationPreset = {
  id: '4-1-4-1',
  name: '4-1-4-1 Diamond',
  shortName: '4-1-4-1',
  description: 'Narrow diamond midfield with one holding midfielder.',
  style: 'balanced',
  positions: [
    { role: 'GK',  x: 50, y: 5,  depth: 0, suggestedPlayerPosition: 'GK' },
    { role: 'RB',  x: 80, y: 20, depth: 1, suggestedPlayerPosition: 'RB' },
    { role: 'RCB', x: 62, y: 18, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'LCB', x: 38, y: 18, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'LB',  x: 20, y: 20, depth: 1, suggestedPlayerPosition: 'LB' },
    { role: 'CDM', x: 50, y: 35, depth: 2, suggestedPlayerPosition: 'CDM' },
    { role: 'RM',  x: 70, y: 52, depth: 3, suggestedPlayerPosition: 'RM' },
    { role: 'CM',  x: 50, y: 55, depth: 3, suggestedPlayerPosition: 'CM' },
    { role: 'LM',  x: 30, y: 52, depth: 3, suggestedPlayerPosition: 'LM' },
    { role: 'CAM', x: 50, y: 72, depth: 4, suggestedPlayerPosition: 'CAM' },
    { role: 'ST',  x: 50, y: 90, depth: 5, suggestedPlayerPosition: 'ST' },
  ]
};

/**
 * 3-4-3 Formation
 * Attacking formation with three forwards
 */
export const formation343: FormationPreset = {
  id: '3-4-3',
  name: '3-4-3 Attack',
  shortName: '3-4-3',
  description: 'Aggressive formation with three forwards and four midfielders.',
  style: 'offensive',
  positions: [
    { role: 'GK',  x: 50, y: 5,  depth: 0, suggestedPlayerPosition: 'GK' },
    { role: 'RCB', x: 65, y: 18, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'CB',  x: 50, y: 16, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'LCB', x: 35, y: 18, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'RM',  x: 78, y: 45, depth: 2, suggestedPlayerPosition: 'RM' },
    { role: 'RCM', x: 58, y: 48, depth: 2, suggestedPlayerPosition: 'CM' },
    { role: 'LCM', x: 42, y: 48, depth: 2, suggestedPlayerPosition: 'CM' },
    { role: 'LM',  x: 22, y: 45, depth: 2, suggestedPlayerPosition: 'LM' },
    { role: 'RW',  x: 75, y: 82, depth: 3, suggestedPlayerPosition: 'RW' },
    { role: 'ST',  x: 50, y: 90, depth: 3, suggestedPlayerPosition: 'ST' },
    { role: 'LW',  x: 25, y: 82, depth: 3, suggestedPlayerPosition: 'LW' },
  ]
};

/**
 * 4-3-1-2 Formation (Christmas Tree)
 * Narrow formation with CAM behind two strikers
 */
export const formation4312: FormationPreset = {
  id: '4-3-1-2',
  name: '4-3-1-2 Christmas Tree',
  shortName: '4-3-1-2',
  description: 'Narrow formation with a playmaker behind two strikers.',
  style: 'offensive',
  positions: [
    { role: 'GK',  x: 50, y: 5,  depth: 0, suggestedPlayerPosition: 'GK' },
    { role: 'RB',  x: 80, y: 20, depth: 1, suggestedPlayerPosition: 'RB' },
    { role: 'RCB', x: 62, y: 18, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'LCB', x: 38, y: 18, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'LB',  x: 20, y: 20, depth: 1, suggestedPlayerPosition: 'LB' },
    { role: 'RCM', x: 62, y: 45, depth: 2, suggestedPlayerPosition: 'CM' },
    { role: 'CM',  x: 50, y: 42, depth: 2, suggestedPlayerPosition: 'CM' },
    { role: 'LCM', x: 38, y: 45, depth: 2, suggestedPlayerPosition: 'CM' },
    { role: 'CAM', x: 50, y: 68, depth: 3, suggestedPlayerPosition: 'CAM' },
    { role: 'RS',  x: 58, y: 88, depth: 4, suggestedPlayerPosition: 'ST' },
    { role: 'LS',  x: 42, y: 88, depth: 4, suggestedPlayerPosition: 'ST' },
  ]
};

/**
 * 5-4-1 Formation
 * Ultra-defensive with one striker
 */
export const formation541: FormationPreset = {
  id: '5-4-1',
  name: '5-4-1 Defensive',
  shortName: '5-4-1',
  description: 'Ultra-defensive setup with five at the back.',
  style: 'defensive',
  positions: [
    { role: 'GK',  x: 50, y: 5,  depth: 0, suggestedPlayerPosition: 'GK' },
    { role: 'RWB', x: 85, y: 25, depth: 1, suggestedPlayerPosition: 'RB' },
    { role: 'RCB', x: 65, y: 18, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'CB',  x: 50, y: 16, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'LCB', x: 35, y: 18, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'LWB', x: 15, y: 25, depth: 1, suggestedPlayerPosition: 'LB' },
    { role: 'RM',  x: 72, y: 48, depth: 2, suggestedPlayerPosition: 'RM' },
    { role: 'RCM', x: 58, y: 45, depth: 2, suggestedPlayerPosition: 'CM' },
    { role: 'LCM', x: 42, y: 45, depth: 2, suggestedPlayerPosition: 'CM' },
    { role: 'LM',  x: 28, y: 48, depth: 2, suggestedPlayerPosition: 'LM' },
    { role: 'ST',  x: 50, y: 85, depth: 3, suggestedPlayerPosition: 'ST' },
  ]
};

/**
 * 4-4-1-1 Formation
 * One striker with CAM support
 */
export const formation4411: FormationPreset = {
  id: '4-4-1-1',
  name: '4-4-1-1',
  shortName: '4-4-1-1',
  description: 'Four midfielders with CAM supporting lone striker.',
  style: 'balanced',
  positions: [
    { role: 'GK',  x: 50, y: 5,  depth: 0, suggestedPlayerPosition: 'GK' },
    { role: 'RB',  x: 80, y: 20, depth: 1, suggestedPlayerPosition: 'RB' },
    { role: 'RCB', x: 62, y: 18, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'LCB', x: 38, y: 18, depth: 1, suggestedPlayerPosition: 'CB' },
    { role: 'LB',  x: 20, y: 20, depth: 1, suggestedPlayerPosition: 'LB' },
    { role: 'RM',  x: 75, y: 48, depth: 2, suggestedPlayerPosition: 'RM' },
    { role: 'RCM', x: 58, y: 45, depth: 2, suggestedPlayerPosition: 'CM' },
    { role: 'LCM', x: 42, y: 45, depth: 2, suggestedPlayerPosition: 'CM' },
    { role: 'LM',  x: 25, y: 48, depth: 2, suggestedPlayerPosition: 'LM' },
    { role: 'CAM', x: 50, y: 70, depth: 3, suggestedPlayerPosition: 'CAM' },
    { role: 'ST',  x: 50, y: 90, depth: 4, suggestedPlayerPosition: 'ST' },
  ]
};

/**
 * All available formation presets
 */
export const allFormations: FormationPreset[] = [
  formation433,    // Default - Austin FC primary
  formation4231,
  formation442,
  formation532,
  formation352,
  formation4141,
  formation343,
  formation4312,
  formation541,
  formation4411,
];

/**
 * Get formation by ID
 */
export function getFormationById(id: string): FormationPreset | undefined {
  return allFormations.find(f => f.id === id);
}

/**
 * Get default formation (4-3-3)
 */
export function getDefaultFormation(): FormationPreset {
  return formation433;
}
