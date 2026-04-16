import type { Frame, Background, GridLayout } from '../types';
import Camera from './Camera';
import styles from './LiveStripPreview.module.css';

interface LiveStripPreviewProps {
  frame: Frame;
  background: Background;
  layout: GridLayout;
  /** isCapturing & countdown forwarded from shooting state (idle = always false/null) */
  isCapturing: boolean;
  countdown: number | null;
  onCapture: (imageData: string) => void;
}

// ── Strip header / footer ─────────────────────────────────────────────────────

function StripHeader({ frame }: { frame: Frame }) {
  return (
    <div className={styles.header} style={{ color: frame.textColor }}>
      {frame.cornerDecor} {frame.cornerDecor} {frame.cornerDecor}
    </div>
  );
}

function StripFooter({ frame }: { frame: Frame }) {
  const dateStr = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  return (
    <div className={styles.footer}>
      <div className={styles.footerDecor} style={{ color: frame.textColor }}>
        {frame.cornerDecor} {frame.cornerDecor} {frame.cornerDecor}
      </div>
      <div className={styles.footerBrand} style={{ color: frame.textColor }}>
        ✨ PhotoBooth ✨
      </div>
      <div className={styles.footerDate} style={{ color: frame.textColor }}>
        {dateStr}
      </div>
    </div>
  );
}

// ── Placeholder slot (for slots that aren't the live camera) ──────────────────

function PlaceholderSlot({
  index,
  frame,
  background,
  className,
}: {
  index: number;
  frame: Frame;
  background: Background;
  className?: string;
}) {
  return (
    <div
      className={`${styles.slot} ${className ?? ''}`}
      style={{ border: frame.borderStyle }}
    >
      {background.id !== 'none' && (
        <div
          className={styles.slotBgOverlay}
          style={background.style}
          aria-hidden="true"
        />
      )}
      <span className={styles.slotNumber}>{index + 1}</span>
    </div>
  );
}

// ── Live camera slot ──────────────────────────────────────────────────────────

function LiveSlot({
  frame,
  background,
  isCapturing,
  countdown,
  onCapture,
  className,
}: {
  frame: Frame;
  background: Background;
  isCapturing: boolean;
  countdown: number | null;
  onCapture: (imageData: string) => void;
  className?: string;
}) {
  return (
    <div
      className={`${styles.slot} ${styles.slotLive} ${className ?? ''}`}
      style={{ border: frame.borderStyle }}
    >
      <Camera
        selectedBackground={background}
        isCapturing={isCapturing}
        countdown={countdown}
        onCapture={onCapture}
      />
    </div>
  );
}

// ── Layout-specific slot grids ────────────────────────────────────────────────

interface SlotsProps {
  frame: Frame;
  background: Background;
  photoCount: number;
  isCapturing: boolean;
  countdown: number | null;
  onCapture: (imageData: string) => void;
  capturedCount: number;
}

/**
 * Returns the slot at `index`: live camera if it's the next to be captured,
 * placeholder otherwise.
 */
function Slot({
  index,
  capturedCount,
  frame,
  background,
  isCapturing,
  countdown,
  onCapture,
  className,
}: SlotsProps & { index: number; className?: string }) {
  const isLive = index === capturedCount;
  if (isLive) {
    return (
      <LiveSlot
        frame={frame}
        background={background}
        isCapturing={isCapturing}
        countdown={countdown}
        onCapture={onCapture}
        className={className}
      />
    );
  }
  return (
    <PlaceholderSlot
      index={index}
      frame={frame}
      background={background}
      className={className}
    />
  );
}

function StripSlots(props: SlotsProps) {
  return (
    <>
      {Array.from({ length: props.photoCount }, (_, i) => (
        <Slot key={i} index={i} {...props} />
      ))}
    </>
  );
}

function Grid2x2Slots(props: SlotsProps) {
  return (
    <div className={styles.grid2x2}>
      {Array.from({ length: 4 }, (_, i) => (
        <Slot key={i} index={i} {...props} className={styles.cellSquare} />
      ))}
    </div>
  );
}

function FeaturedSlots(props: SlotsProps) {
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

function DuoSlots(props: SlotsProps) {
  return (
    <div className={styles.duoLayout}>
      {[0, 1].map(i => (
        <Slot key={i} index={i} {...props} className={styles.cellTall} />
      ))}
    </div>
  );
}

function SingleSlot(props: SlotsProps) {
  return <Slot index={0} {...props} className={styles.cellWide} />;
}

function LayoutSlots({ layoutId, ...rest }: SlotsProps & { layoutId: string }) {
  switch (layoutId) {
    case 'grid-2x2': return <Grid2x2Slots {...rest} />;
    case 'grid-1-3': return <FeaturedSlots {...rest} />;
    case 'grid-2-1': return <DuoSlots {...rest} />;
    case 'single':   return <SingleSlot {...rest} />;
    default:         return <StripSlots {...rest} />;
  }
}

// ── Root component ────────────────────────────────────────────────────────────

/**
 * Shows the full photo strip frame with the live camera feed inside the
 * "next" slot — so the user sees exactly what the final result will look like
 * before and during shooting.
 */
export default function LiveStripPreview({
  frame,
  background,
  layout,
  isCapturing,
  countdown,
  onCapture,
}: LiveStripPreviewProps) {
  // During idle, capturedCount = 0 so slot 0 is always the live camera.
  // During shooting this component is replaced by the shooting view,
  // but we keep the prop for reuse.
  const capturedCount = 0;

  const isWide =
    layout.id === 'grid-2x2' ||
    layout.id === 'grid-2-1' ||
    layout.id === 'grid-1-3' ||
    layout.id === 'single';

  return (
    <div
      className={`${styles.strip} ${isWide ? styles.stripWide : ''}`}
      style={{
        background: frame.stripBg,
        boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 0 0 3px ${frame.borderColor}`,
      }}
    >
      <StripHeader frame={frame} />

      <LayoutSlots
        layoutId={layout.id}
        frame={frame}
        background={background}
        photoCount={layout.photoCount}
        isCapturing={isCapturing}
        countdown={countdown}
        onCapture={onCapture}
        capturedCount={capturedCount}
      />

      <StripFooter frame={frame} />
    </div>
  );
}
