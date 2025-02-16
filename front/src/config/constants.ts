export const PRIORITIES = {
  VITAL: 'vital',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export const STATUS_LABELS = {
  CONSCIOUSNESS: 'Consciousness Level',
  PAIN_LEVEL: 'Pain Level (1-10)',
  TEMPERATURE: 'Temperature',
} as const;

export const NOTE_TYPES = {
  PRIMARY: 'primary',
  HISTORY: 'history',
  SECONDARY: 'secondary',
} as const;

export const DEFAULT_STATUS = 'Unknown';

export const MAX_NOTES_HEIGHT = 300; // in pixels 