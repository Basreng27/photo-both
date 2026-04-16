import type { Background } from '../types';

export const backgrounds: Background[] = [
  {
    id: 'none',
    name: 'No Filter',
    emoji: '📷',
    style: {},
  },
  {
    id: 'galaxy',
    name: 'Galaxy',
    emoji: '🌌',
    style: {
      background: 'radial-gradient(ellipse at center, #1b2735 0%, #090a0f 100%)',
      backgroundImage: `
        radial-gradient(ellipse at center, #1b2735 0%, #090a0f 100%)
      `,
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    emoji: '🌅',
    style: {
      background: 'linear-gradient(180deg, #ff6b35 0%, #f7c59f 40%, #efefd0 70%, #004e89 100%)',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    emoji: '🌿',
    style: {
      background: 'linear-gradient(180deg, #134e5e 0%, #71b280 100%)',
    },
  },
  {
    id: 'candy',
    name: 'Candy',
    emoji: '🍭',
    style: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #fda085 100%)',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    emoji: '🌊',
    style: {
      background: 'linear-gradient(180deg, #2980b9 0%, #6dd5fa 50%, #ffffff 100%)',
    },
  },
  {
    id: 'aurora',
    name: 'Aurora',
    emoji: '🌈',
    style: {
      background: 'linear-gradient(135deg, #0f3460 0%, #16213e 25%, #0f3460 50%, #533483 75%, #e94560 100%)',
    },
  },
  {
    id: 'cherry',
    name: 'Cherry Blossom',
    emoji: '🌸',
    style: {
      background: 'linear-gradient(180deg, #ffecd2 0%, #fcb69f 50%, #ff9a9e 100%)',
    },
  },
];
