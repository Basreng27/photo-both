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
