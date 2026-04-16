import type { GridLayout } from '../types';

/**
 * All available photo grid layouts.
 * Each layout defines how many photos to capture and how they are arranged.
 */
export const layouts: GridLayout[] = [
  {
    id: 'strip-4',
    name: 'Classic Strip',
    description: '4 foto vertikal seperti photobooth asli',
    emoji: '🎞️',
    photoCount: 4,
    aspectRatio: 1 / 3.2,
  },
  {
    id: 'strip-3',
    name: 'Mini Strip',
    description: '3 foto vertikal compact',
    emoji: '📽️',
    photoCount: 3,
    aspectRatio: 1 / 2.4,
  },
  {
    id: 'grid-2x2',
    name: 'Grid 2×2',
    description: '4 foto dalam kotak seperti Instagram',
    emoji: '⊞',
    photoCount: 4,
    aspectRatio: 1,
  },
  {
    id: 'grid-1-3',
    name: 'Featured',
    description: '1 foto besar + 3 foto kecil di bawah',
    emoji: '🖼️',
    photoCount: 4,
    aspectRatio: 3 / 4,
  },
  {
    id: 'grid-2-1',
    name: 'Duo',
    description: '2 foto berdampingan',
    emoji: '◫',
    photoCount: 2,
    aspectRatio: 2,
  },
  {
    id: 'single',
    name: 'Single',
    description: '1 foto dengan frame penuh',
    emoji: '🟦',
    photoCount: 1,
    aspectRatio: 4 / 3,
  },
];
