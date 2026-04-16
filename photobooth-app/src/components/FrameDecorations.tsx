import type { Frame } from '../types';

const getDate = () =>
  new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

function DefaultHeader({ frame }: { frame: Frame }) {
  return (
    <div style={{ textAlign: 'center', color: frame.textColor, fontSize: 18, letterSpacing: 4, padding: '4px 0' }}>
      {frame.cornerDecor} {frame.cornerDecor} {frame.cornerDecor}
    </div>
  );
}

function DefaultFooter({ frame }: { frame: Frame }) {
  return (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 2, padding: '4px 0' }}>
      <div style={{ color: frame.textColor, fontSize: 16, letterSpacing: 4 }}>
        {frame.cornerDecor} {frame.cornerDecor} {frame.cornerDecor}
      </div>
      <div style={{ color: frame.textColor, fontSize: 11, fontWeight: 700, opacity: 0.85, fontFamily: 'Pacifico, cursive' }}>
        ✨ PhotoBooth ✨
      </div>
      <div style={{ color: frame.textColor, fontSize: 10, opacity: 0.55 }}>{getDate()}</div>
    </div>
  );
}

export interface FrameDecorComponents {
  Header: React.FC<{ frame: Frame }>;
  Footer: React.FC<{ frame: Frame }>;
}

const registry: Record<string, FrameDecorComponents> = {};

function reg(id: string, Header: React.FC<{ frame: Frame }>, Footer: React.FC<{ frame: Frame }>) {
  registry[id] = { Header, Footer };
}

export function getFrameDecor(frameId: string): FrameDecorComponents {
  return registry[frameId] ?? { Header: DefaultHeader, Footer: DefaultFooter };
}
// ── Newspaper ─────────────────────────────────────────────────────────────────

function NewspaperHeader({ frame: _frame }: { frame: Frame }) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div style={{ background: '#1a1a1a', color: '#f5f0e8', padding: '6px 8px', fontFamily: 'Georgia, serif' }}>
      <div style={{ fontSize: 7, letterSpacing: 2, textAlign: 'center', opacity: 0.7, borderBottom: '1px solid #555', paddingBottom: 3, marginBottom: 3 }}>
        ★ EDISI KHUSUS ★
      </div>
      <div style={{ fontSize: 18, fontWeight: 900, textAlign: 'center', letterSpacing: -0.5, lineHeight: 1 }}>
        PHOTO BOOTH
      </div>
      <div style={{ fontSize: 7, textAlign: 'center', opacity: 0.6, marginTop: 2, borderTop: '1px solid #555', paddingTop: 3 }}>
        {dateStr}
      </div>
    </div>
  );
}

function NewspaperFooter({ frame: _frame }: { frame: Frame }) {
  return (
    <div style={{ background: '#1a1a1a', color: '#f5f0e8', padding: '5px 8px', fontFamily: 'Georgia, serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 7, opacity: 0.6, borderTop: '1px solid #555', paddingTop: 3 }}>
        <span>© PhotoBooth Press</span>
        <span>Harga: GRATIS</span>
        <span>Edisi Terbatas</span>
      </div>
    </div>
  );
}

// ── Movie Poster ──────────────────────────────────────────────────────────────

function MovieHeader({ frame: _frame }: { frame: Frame }) {
  return (
    <div style={{ textAlign: 'center', padding: '6px 4px 4px', background: 'linear-gradient(180deg,#1c0a00,transparent)' }}>
      <svg width="100%" height="28" viewBox="0 0 220 28">
        <rect x="0" y="12" width="60" height="2" fill="#ffd700" opacity="0.6"/>
        <rect x="160" y="12" width="60" height="2" fill="#ffd700" opacity="0.6"/>
        <text x="110" y="18" textAnchor="middle" fill="#ffd700" fontSize="11" fontWeight="900" fontFamily="Georgia,serif" letterSpacing="4">★ PHOTO ★</text>
      </svg>
    </div>
  );
}

function MovieFooter({ frame: _frame }: { frame: Frame }) {
  const yr = new Date().getFullYear();
  return (
    <div style={{ textAlign: 'center', padding: '4px 4px 6px', background: 'linear-gradient(0deg,#1c0a00,transparent)' }}>
      <svg width="100%" height="36" viewBox="0 0 220 36">
        <text x="110" y="14" textAnchor="middle" fill="#ffd700" fontSize="14" fontWeight="900" fontFamily="Pacifico,cursive">PhotoBooth</text>
        <rect x="20" y="18" width="180" height="1" fill="#ffd700" opacity="0.4"/>
        <text x="110" y="30" textAnchor="middle" fill="#ffd700" fontSize="7" fontFamily="Georgia,serif" letterSpacing="3" opacity="0.7">A {yr} PRODUCTION</text>
      </svg>
    </div>
  );
}

// ── One Piece / Grand Line ────────────────────────────────────────────────────

function OnePieceHeader({ frame: _frame }: { frame: Frame }) {
  return (
    <div style={{ textAlign: 'center', padding: '4px 4px 2px' }}>
      <svg width="100%" height="44" viewBox="0 0 220 44">
        {/* Jolly Roger skull */}
        <circle cx="110" cy="16" r="12" fill="#c0392b" stroke="#f39c12" strokeWidth="1.5"/>
        <circle cx="106" cy="14" r="2.5" fill="#1a0a00"/>
        <circle cx="114" cy="14" r="2.5" fill="#1a0a00"/>
        <path d="M104 20 Q110 24 116 20" stroke="#1a0a00" strokeWidth="1.5" fill="none"/>
        {/* Crossbones */}
        <line x1="94" y1="10" x2="126" y2="30" stroke="#f39c12" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="126" y1="10" x2="94" y2="30" stroke="#f39c12" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Title */}
        <text x="110" y="42" textAnchor="middle" fill="#f39c12" fontSize="9" fontWeight="900" fontFamily="Georgia,serif" letterSpacing="2">GRAND LINE</text>
      </svg>
    </div>
  );
}

function OnePieceFooter({ frame: _frame }: { frame: Frame }) {
  return (
    <div style={{ textAlign: 'center', padding: '2px 4px 6px' }}>
      <svg width="100%" height="32" viewBox="0 0 220 32">
        <text x="110" y="13" textAnchor="middle" fill="#f39c12" fontSize="11" fontWeight="900" fontFamily="Pacifico,cursive">PhotoBooth</text>
        <text x="110" y="26" textAnchor="middle" fill="#c0392b" fontSize="8" fontFamily="Georgia,serif" letterSpacing="1">⚓ NAKAMA FOREVER ⚓</text>
      </svg>
    </div>
  );
}

// ── Sakura ────────────────────────────────────────────────────────────────────

const SAKURA_PETALS = [
  { x: 30,  y: 22, r: 0   },
  { x: 55,  y: 12, r: 37  },
  { x: 80,  y: 20, r: 74  },
  { x: 110, y: 16, r: 111 },
  { x: 140, y: 14, r: 148 },
  { x: 165, y: 18, r: 185 },
  { x: 190, y: 10, r: 222 },
];

function SakuraPetal({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={'translate(' + x + ',' + y + ')'}>
      <ellipse rx="4" ry="2.5" fill="#e8a0bf" opacity="0.8" transform={'rotate(' + r + ')'}/>
      <ellipse rx="4" ry="2.5" fill="#f48fb1" opacity="0.7" transform={'rotate(' + (r + 72) + ')'}/>
      <ellipse rx="4" ry="2.5" fill="#e8a0bf" opacity="0.8" transform={'rotate(' + (r + 144) + ')'}/>
      <ellipse rx="4" ry="2.5" fill="#f48fb1" opacity="0.7" transform={'rotate(' + (r + 216) + ')'}/>
      <ellipse rx="4" ry="2.5" fill="#e8a0bf" opacity="0.8" transform={'rotate(' + (r + 288) + ')'}/>
      <circle r="1.5" fill="#fce4ec"/>
    </g>
  );
}

function SakuraHeader({ frame: _frame }: { frame: Frame }) {
  return (
    <div style={{ textAlign: 'center', padding: '4px 4px 2px' }}>
      <svg width="100%" height="36" viewBox="0 0 220 36">
        <path d="M20 28 Q60 10 110 18 Q160 26 200 8" stroke="#c2185b" strokeWidth="1.5" fill="none" opacity="0.5"/>
        {SAKURA_PETALS.map((p, i) => <SakuraPetal key={i} {...p} />)}
      </svg>
    </div>
  );
}

function SakuraFooter({ frame: _frame }: { frame: Frame }) {
  return (
    <div style={{ textAlign: 'center', padding: '2px 4px 4px' }}>
      <svg width="100%" height="30" viewBox="0 0 220 30">
        <text x="110" y="14" textAnchor="middle" fill="#c2185b" fontSize="11" fontWeight="700" fontFamily="Pacifico,cursive">PhotoBooth</text>
        <text x="110" y="26" textAnchor="middle" fill="#e8a0bf" fontSize="9" fontFamily="Georgia,serif">❀ 桜 ❀</text>
      </svg>
    </div>
  );
}

// ── Galaxy / Space ────────────────────────────────────────────────────────────

function GalaxyHeader({ frame: _frame }: { frame: Frame }) {
  return (
    <div style={{ textAlign: 'center', padding: '4px 4px 2px' }}>
      <svg width="100%" height="36" viewBox="0 0 220 36">
        {/* Stars */}
        {[15,35,55,80,100,125,145,170,195,210].map((x,i) => (
          <circle key={i} cx={x} cy={[8,20,6,16,24,10,22,8,18,12][i]} r={[1,1.5,1,2,1,1.5,1,2,1,1.5][i]} fill="white" opacity={[0.9,0.7,1,0.8,0.6,0.9,0.7,1,0.8,0.6][i]}/>
        ))}
        {/* Planet */}
        <circle cx="110" cy="18" r="10" fill="#9c27b0" opacity="0.7"/>
        <ellipse cx="110" cy="18" rx="16" ry="4" fill="none" stroke="#e040fb" strokeWidth="1.5" opacity="0.6"/>
        <circle cx="110" cy="18" r="10" fill="url(#planetGrad)" opacity="0.5"/>
        <defs>
          <radialGradient id="planetGrad" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#ce93d8"/>
            <stop offset="100%" stopColor="#4a148c"/>
          </radialGradient>
        </defs>
        {/* Sparkles */}
        <text x="40" y="14" fill="#e040fb" fontSize="10" opacity="0.8">✦</text>
        <text x="170" y="22" fill="#7c4dff" fontSize="8" opacity="0.7">✦</text>
      </svg>
    </div>
  );
}

function GalaxyFooter({ frame: _frame }: { frame: Frame }) {
  return (
    <div style={{ textAlign: 'center', padding: '2px 4px 4px' }}>
      <svg width="100%" height="30" viewBox="0 0 220 30">
        {[20,50,80,110,140,170,200].map((x,i) => (
          <circle key={i} cx={x} cy={[8,15,5,12,18,7,10][i]} r="1" fill="white" opacity="0.6"/>
        ))}
        <text x="110" y="16" textAnchor="middle" fill="#e040fb" fontSize="11" fontWeight="700" fontFamily="Pacifico,cursive">PhotoBooth</text>
        <text x="110" y="27" textAnchor="middle" fill="#9c27b0" fontSize="8" fontFamily="Georgia,serif" letterSpacing="2">✦ UNIVERSE ✦</text>
      </svg>
    </div>
  );
}

// ── Neon City ─────────────────────────────────────────────────────────────────

function NeonHeader({ frame: _frame }: { frame: Frame }) {
  return (
    <div style={{ textAlign: 'center', padding: '4px 4px 2px' }}>
      <svg width="100%" height="36" viewBox="0 0 220 36">
        {/* City skyline silhouette */}
        <path d="M0 36 L0 22 L15 22 L15 14 L20 14 L20 22 L35 22 L35 18 L40 18 L40 22 L55 22 L55 10 L60 10 L60 6 L65 6 L65 10 L70 10 L70 22 L85 22 L85 16 L90 16 L90 22 L105 22 L105 12 L110 8 L115 12 L115 22 L130 22 L130 18 L135 18 L135 22 L150 22 L150 14 L155 14 L155 22 L170 22 L170 20 L175 20 L175 22 L190 22 L190 16 L195 16 L195 22 L220 22 L220 36 Z" fill="#0d0d0d"/>
        {/* Neon glow lines */}
        <line x1="0" y1="22" x2="220" y2="22" stroke="#00f5ff" strokeWidth="1" opacity="0.4"/>
        {/* Neon sign */}
        <rect x="75" y="2" width="70" height="16" rx="3" fill="none" stroke="#00f5ff" strokeWidth="1" opacity="0.6"/>
        <text x="110" y="14" textAnchor="middle" fill="#00f5ff" fontSize="9" fontWeight="900" fontFamily="monospace" letterSpacing="2">PHOTO</text>
      </svg>
    </div>
  );
}

function NeonFooter({ frame: _frame }: { frame: Frame }) {
  return (
    <div style={{ textAlign: 'center', padding: '2px 4px 4px' }}>
      <svg width="100%" height="28" viewBox="0 0 220 28">
        <line x1="10" y1="4" x2="210" y2="4" stroke="#00f5ff" strokeWidth="0.5" opacity="0.3"/>
        <text x="110" y="16" textAnchor="middle" fill="#00f5ff" fontSize="11" fontWeight="700" fontFamily="Pacifico,cursive" filter="url(#neonGlow)">PhotoBooth</text>
        <text x="110" y="26" textAnchor="middle" fill="#ff00ff" fontSize="7" fontFamily="monospace" letterSpacing="3" opacity="0.7">CYBER STUDIO</text>
        <defs>
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}

// ── Register all frames ───────────────────────────────────────────────────────

reg('newspaper', NewspaperHeader, NewspaperFooter);
reg('movie', MovieHeader, MovieFooter);
reg('onepiece', OnePieceHeader, OnePieceFooter);
reg('sakura', SakuraHeader, SakuraFooter);
reg('galaxy', GalaxyHeader, GalaxyFooter);
reg('neon', NeonHeader, NeonFooter);


