import type { Frame } from '../types';

export const frames: Frame[] = [
  // ── 1. Classic Film Strip ────────────────────────────────────────────────
  {
    id: 'classic',
    name: 'Classic',
    emoji: '🎞️',
    borderColor: '#ffffff',
    borderStyle: '6px solid #ffffff',
    bgColor: '#1a1a1a',
    textColor: '#ffffff',
    cornerDecor: '★',
    stripBg: 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)',
  },

  // ── 2. Kawaii ────────────────────────────────────────────────────────────
  {
    id: 'kawaii',
    name: 'Kawaii',
    emoji: '🌸',
    borderColor: '#ff9eb5',
    borderStyle: '6px solid #ff9eb5',
    bgColor: '#fff0f5',
    textColor: '#ff6b9d',
    cornerDecor: '♥',
    stripBg: 'linear-gradient(180deg, #ffe4f0 0%, #ffd6e8 100%)',
    stripClass: 'frameKawaii',
  },

  // ── 3. Retro 70s ─────────────────────────────────────────────────────────
  {
    id: 'retro',
    name: 'Retro 70s',
    emoji: '🌈',
    borderColor: '#f4a261',
    borderStyle: '6px solid #f4a261',
    bgColor: '#264653',
    textColor: '#e9c46a',
    cornerDecor: '✿',
    stripBg: 'linear-gradient(180deg, #264653 0%, #2a9d8f 100%)',
    stripClass: 'frameRetro',
  },

  // ── 4. Neon Cyberpunk ────────────────────────────────────────────────────
  {
    id: 'neon',
    name: 'Neon City',
    emoji: '⚡',
    borderColor: '#00f5ff',
    borderStyle: '4px solid #00f5ff',
    bgColor: '#0d0d0d',
    textColor: '#00f5ff',
    cornerDecor: '◆',
    stripBg: 'linear-gradient(180deg, #0d0d0d 0%, #1a0033 100%)',
    stripClass: 'frameNeon',
  },

  // ── 5. Newspaper ─────────────────────────────────────────────────────────
  {
    id: 'newspaper',
    name: 'Koran Jadul',
    emoji: '📰',
    borderColor: '#2a1f0e',
    borderStyle: '6px double #2a1f0e',
    bgColor: '#f0e6d0',
    textColor: '#2a1f0e',
    cornerDecor: '■',
    stripBg: '#f0e6d0',
    stripClass: 'frameNewspaper',
  },

  // ── 6. Movie Poster ──────────────────────────────────────────────────────
  {
    id: 'movie',
    name: 'Movie Poster',
    emoji: '🎬',
    borderColor: '#ffd700',
    borderStyle: '6px solid #ffd700',
    bgColor: '#0a0a0a',
    textColor: '#ffd700',
    cornerDecor: '★',
    stripBg: 'linear-gradient(180deg, #0a0a0a 0%, #1c0a00 100%)',
    stripClass: 'frameMovie',
  },

  // ── 7. One Piece / Pirate ────────────────────────────────────────────────
  {
    id: 'onepiece',
    name: 'Grand Line',
    emoji: '☠️',
    borderColor: '#c0392b',
    borderStyle: '6px solid #c0392b',
    bgColor: '#1a0a00',
    textColor: '#f39c12',
    cornerDecor: '☠',
    stripBg: 'linear-gradient(180deg, #1a0a00 0%, #2c1810 100%)',
    stripClass: 'frameOnePiece',
  },

  // ── 8. Sakura / Japan ────────────────────────────────────────────────────
  {
    id: 'sakura',
    name: 'Sakura',
    emoji: '🌸',
    borderColor: '#e8a0bf',
    borderStyle: '6px solid #e8a0bf',
    bgColor: '#fff5f8',
    textColor: '#c2185b',
    cornerDecor: '❀',
    stripBg: 'linear-gradient(180deg, #fff5f8 0%, #fce4ec 100%)',
    stripClass: 'frameSakura',
  },

  // ── 9. Galaxy / Space ────────────────────────────────────────────────────
  {
    id: 'galaxy',
    name: 'Galaxy',
    emoji: '🌌',
    borderColor: '#9c27b0',
    borderStyle: '4px solid #9c27b0',
    bgColor: '#050520',
    textColor: '#e040fb',
    cornerDecor: '✦',
    stripBg: 'linear-gradient(180deg, #050520 0%, #0d0d3a 50%, #1a0030 100%)',
    stripClass: 'frameGalaxy',
  },

  // ── 10. Vintage Polaroid ─────────────────────────────────────────────────
  {
    id: 'polaroid',
    name: 'Polaroid',
    emoji: '📷',
    borderColor: '#d4c5a9',
    borderStyle: '10px solid #d4c5a9',
    bgColor: '#faf6f0',
    textColor: '#5c4a32',
    cornerDecor: '◉',
    stripBg: 'linear-gradient(180deg, #faf6f0 0%, #f0e8d8 100%)',
    stripClass: 'framePolaroid',
  },

  // ── 11. Tropical Beach ───────────────────────────────────────────────────
  {
    id: 'beach',
    name: 'Tropical',
    emoji: '🏖️',
    borderColor: '#00b4d8',
    borderStyle: '6px solid #00b4d8',
    bgColor: '#023e8a',
    textColor: '#90e0ef',
    cornerDecor: '🌴',
    stripBg: 'linear-gradient(180deg, #0077b6 0%, #023e8a 100%)',
    stripClass: 'frameBeach',
  },

  // ── 12. Horror / Halloween ───────────────────────────────────────────────
  {
    id: 'horror',
    name: 'Horror',
    emoji: '🎃',
    borderColor: '#ff6b00',
    borderStyle: '6px solid #ff6b00',
    bgColor: '#0d0000',
    textColor: '#ff6b00',
    cornerDecor: '🕷',
    stripBg: 'linear-gradient(180deg, #0d0000 0%, #1a0500 100%)',
    stripClass: 'frameHorror',
  },

  // ── 13. Pastel Dream ─────────────────────────────────────────────────────
  {
    id: 'pastel',
    name: 'Pastel Dream',
    emoji: '🦄',
    borderColor: '#c8b6ff',
    borderStyle: '6px solid #c8b6ff',
    bgColor: '#f8f0ff',
    textColor: '#9b72cf',
    cornerDecor: '✦',
    stripBg: 'linear-gradient(180deg, #e8d5ff 0%, #d4b8ff 100%)',
  },

  // ── 14. Anime / Manga ────────────────────────────────────────────────────
  {
    id: 'manga',
    name: 'Manga',
    emoji: '💥',
    borderColor: '#000000',
    borderStyle: '8px solid #000000',
    bgColor: '#ffffff',
    textColor: '#000000',
    cornerDecor: '✦',
    stripBg: '#ffffff',
    stripClass: 'frameManga',
  },

  // ── 15. Vintage Gold ─────────────────────────────────────────────────────
  {
    id: 'gold',
    name: 'Royal Gold',
    emoji: '👑',
    borderColor: '#d4af37',
    borderStyle: '8px solid #d4af37',
    bgColor: '#1a1200',
    textColor: '#d4af37',
    cornerDecor: '❧',
    stripBg: 'linear-gradient(180deg, #1a1200 0%, #2d1f00 100%)',
    stripClass: 'frameGold',
  },
];
