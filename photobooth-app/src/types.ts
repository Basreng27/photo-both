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
  /**
   * Optional CSS class name applied to the strip wrapper.
   * Used by rich frames to inject background patterns / textures.
   */
  stripClass?: string;
}

export interface Background {
  id: string;
  name: string;
  emoji: string;
  style: React.CSSProperties;
}

export interface GridLayout {
  id: string;
  name: string;
  description: string;
  emoji: string;
  photoCount: number;
  aspectRatio: number;
}
