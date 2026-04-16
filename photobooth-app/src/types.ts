export type AppState = 'setup' | 'shooting' | 'result';

export interface Frame {
  id: string;
  name: string;
  emoji: string;
  borderColor: string;
  borderStyle: string;
  bgColor: string;
  textColor: string;
  cornerDecor: string;
  stripBg: string;
}

export interface Background {
  id: string;
  name: string;
  emoji: string;
  style: React.CSSProperties;
}

/**
 * Describes how photos are arranged in the final output.
 * photoCount: how many photos to capture for this layout.
 * aspectRatio: the output canvas aspect ratio (width / height).
 */
export interface GridLayout {
  id: string;
  name: string;
  description: string;
  emoji: string;
  photoCount: number;
  aspectRatio: number;
}
