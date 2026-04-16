import type { Frame, Background, GridLayout } from '../types';
import Camera from './Camera';
import { getFrameDecor } from './FrameDecorations';
import NewspaperLayout from './NewspaperLayout';
import styles from './LiveStripPreview.module.css';
import '../styles/frameDecorations.css';

interface ShootingStripPreviewProps {
  frame: Frame;
  background: Background;
  layout: GridLayout;
  capturedPhotos: string[];
  isCapturing: boolean;
  countdown: number | null;
  onCapture: (imageData: string) => void;
}

// ── Strip header / footer (reused from LiveStripPreview) ──────────────────────

function StripHeader({ frame }: { frame: Frame }) {
  const { Header } = getFrameDecor(frame.id);
  return <Header frame={frame} />;
}

function StripFooter({ frame }: { frame: Frame }) {
  const { Footer } = getFrameDecor(frame.id);
  return <Footer frame={frame} />;
}

// ── Individual slot ───────────────────────────────────────────────────────────

interface SlotProps {
  index: number;
  capturedPhotos: string[];
  frame: Frame;
  background: Background;
  isCapturing: boolean;
  countdown: number | null;
  onCapture: (imageData: string) => void;
  className?: string;
}

function Slot({
  index,
  capturedPhotos,
  frame,
  background,
  isCapturing,
  countdown,
  onCapture,
  className,
}: SlotProps) {
  const capturedPhoto = capturedPhotos[index];
  const isLive = index === capturedPhotos.length;
  const slotStyle = { border: frame.borderStyle };

  // Already captured — show the photo
  if (capturedPhoto) {
    return (
      <div className={`${styles.slot} ${className ?? ''}`} style={slotStyle}>
        {background.id !== 'none' && (
          <div
            className={styles.slotBgOverlay}
            style={background.style}
            aria-hidden="true"
          />
        )}
        <img
          src={capturedPhoto}
          alt={`Foto ${index + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
    );
  }

  // Current slot — show live camera
  if (isLive) {
    return (
      <div className={`${styles.slot} ${styles.slotLive} ${className ?? ''}`} style={slotStyle}>
        <Camera
          selectedBackground={background}
          isCapturing={isCapturing}
          countdown={countdown}
          onCapture={onCapture}
        />
      </div>
    );
  }

  // Future slot — placeholder
  return (
    <div className={`${styles.slot} ${className ?? ''}`} style={slotStyle}>
      <span className={styles.slotNumber}>{index + 1}</span>
    </div>
  );
}

// ── Layout-specific grids ─────────────────────────────────────────────────────

type LayoutSlotsProps = Omit<SlotProps, 'index' | 'className'> & {
  layoutId: string;
  photoCount: number;
};

function StripSlots({ photoCount, ...rest }: LayoutSlotsProps) {
  return (
    <>
      {Array.from({ length: photoCount }, (_, i) => (
        <Slot key={i} index={i} {...rest} />
      ))}
    </>
  );
}

function Grid2x2Slots(props: LayoutSlotsProps) {
  return (
    <div className={styles.grid2x2}>
      {Array.from({ length: 4 }, (_, i) => (
        <Slot key={i} index={i} {...props} className={styles.cellSquare} />
      ))}
    </div>
  );
}

function FeaturedSlots(props: LayoutSlotsProps) {
  return (
    <div className={styles.featuredLayout}>
      <Slot index={0} {...props} className={styles.cellWide} />
      <div className={styles.featuredRow}>
        {[1, 2, 3].map(i => (
          <Slot key={i} index={i} {...props} className={styles.cellSquare} />
        ))}
      </div>
    </div>
  );
}

function DuoSlots(props: LayoutSlotsProps) {
  return (
    <div className={styles.duoLayout}>
      {[0, 1].map(i => (
        <Slot key={i} index={i} {...props} className={styles.cellTall} />
      ))}
    </div>
  );
}

function SingleSlot(props: LayoutSlotsProps) {
  return <Slot index={0} {...props} className={styles.cellWide} />;
}

function LayoutSlots({ layoutId, ...rest }: LayoutSlotsProps) {
  switch (layoutId) {
    case 'grid-2x2': return <Grid2x2Slots {...rest} layoutId={layoutId} />;
    case 'grid-1-3': return <FeaturedSlots {...rest} layoutId={layoutId} />;
    case 'grid-2-1': return <DuoSlots {...rest} layoutId={layoutId} />;
    case 'single':   return <SingleSlot {...rest} layoutId={layoutId} />;
    default:         return <StripSlots {...rest} layoutId={layoutId} />;
  }
}

// ── Root component ────────────────────────────────────────────────────────────

/**
 * During shooting: renders the strip with already-captured photos filling
 * their slots, the live camera in the current slot, and placeholders for
 * future slots — so the user sees the strip filling up in real time.
 */
export default function ShootingStripPreview({
  frame,
  background,
  layout,
  capturedPhotos,
  isCapturing,
  countdown,
  onCapture,
}: ShootingStripPreviewProps) {
  // Newspaper frame gets its own full-page layout
  if (frame.id === 'newspaper') {
    return (
      <NewspaperLayout
        photoCount={layout.photoCount}
        capturedPhotos={capturedPhotos}
        background={background}
        isCapturing={isCapturing}
        countdown={countdown}
        onCapture={onCapture}
      />
    );
  }

  const isWide =
    layout.id === 'grid-2x2' ||
    layout.id === 'grid-2-1' ||
    layout.id === 'grid-1-3' ||
    layout.id === 'single';

  return (
    <div
      className={`${styles.strip} ${isWide ? styles.stripWide : ''} ${frame.stripClass ?? ''}`}
      style={{
        background: frame.stripBg,
        boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 0 0 3px ${frame.borderColor}`,
      }}
    >
      <StripHeader frame={frame} />

      <LayoutSlots
        layoutId={layout.id}
        photoCount={layout.photoCount}
        capturedPhotos={capturedPhotos}
        frame={frame}
        background={background}
        isCapturing={isCapturing}
        countdown={countdown}
        onCapture={onCapture}
      />

      <StripFooter frame={frame} />
    </div>
  );
}
