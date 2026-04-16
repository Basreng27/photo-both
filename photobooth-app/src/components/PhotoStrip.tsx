import type { Frame, Background, GridLayout } from '../types';
import { getFrameDecor } from './FrameDecorations';
import NewspaperLayout from './NewspaperLayout';
import styles from './PhotoStrip.module.css';
import '../styles/frameDecorations.css';

interface PhotoStripProps {
  photos: string[];
  frame: Frame;
  background: Background;
  layout: GridLayout;
  onDownload: () => void;
  onRetake: () => void;
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function StripDecoration({ frame }: { frame: Frame }) {
  const { Header } = getFrameDecor(frame.id);
  return <Header frame={frame} />;
}

function StripFooter({ frame }: { frame: Frame }) {
  const { Footer } = getFrameDecor(frame.id);
  return <Footer frame={frame} />;
}

function PhotoSlot({
  photo,
  index,
  background,
  frame,
  className,
}: {
  photo: string;
  index: number;
  background: Background;
  frame: Frame;
  className?: string;
}) {
  return (
    <div
      className={`${styles.photoSlot} ${className ?? ''}`}
      style={{ border: frame.borderStyle }}
    >
      {background.id !== 'none' && (
        <div
          className={styles.backgroundOverlay}
          style={background.style}
          aria-hidden="true"
        />
      )}
      <img src={photo} alt={`Foto ${index + 1}`} className={styles.photo} />
      <div className={styles.photoBadge}>{index + 1}</div>
    </div>
  );
}

// ── Layout renderers ──────────────────────────────────────────────────────────

function StripLayout({
  photos,
  frame,
  background,
}: {
  photos: string[];
  frame: Frame;
  background: Background;
}) {
  return (
    <>
      {photos.map((photo, i) => (
        <PhotoSlot key={i} photo={photo} index={i} background={background} frame={frame} />
      ))}
    </>
  );
}

function Grid2x2Layout({
  photos,
  frame,
  background,
}: {
  photos: string[];
  frame: Frame;
  background: Background;
}) {
  return (
    <div className={styles.grid2x2}>
      {photos.map((photo, i) => (
        <PhotoSlot
          key={i}
          photo={photo}
          index={i}
          background={background}
          frame={frame}
          className={styles.gridCell}
        />
      ))}
    </div>
  );
}

function FeaturedLayout({
  photos,
  frame,
  background,
}: {
  photos: string[];
  frame: Frame;
  background: Background;
}) {
  return (
    <div className={styles.featuredLayout}>
      <PhotoSlot
        photo={photos[0]}
        index={0}
        background={background}
        frame={frame}
        className={styles.featuredBig}
      />
      <div className={styles.featuredRow}>
        {photos.slice(1).map((photo, i) => (
          <PhotoSlot
            key={i + 1}
            photo={photo}
            index={i + 1}
            background={background}
            frame={frame}
            className={styles.featuredSmall}
          />
        ))}
      </div>
    </div>
  );
}

function DuoLayout({
  photos,
  frame,
  background,
}: {
  photos: string[];
  frame: Frame;
  background: Background;
}) {
  return (
    <div className={styles.duoLayout}>
      {photos.map((photo, i) => (
        <PhotoSlot
          key={i}
          photo={photo}
          index={i}
          background={background}
          frame={frame}
          className={styles.duoCell}
        />
      ))}
    </div>
  );
}

function SingleLayout({
  photos,
  frame,
  background,
}: {
  photos: string[];
  frame: Frame;
  background: Background;
}) {
  return (
    <PhotoSlot
      photo={photos[0]}
      index={0}
      background={background}
      frame={frame}
      className={styles.singleSlot}
    />
  );
}

// ── Layout dispatcher ─────────────────────────────────────────────────────────

function PhotoGrid({
  photos,
  frame,
  background,
  layoutId,
}: {
  photos: string[];
  frame: Frame;
  background: Background;
  layoutId: string;
}) {
  switch (layoutId) {
    case 'grid-2x2':
      return <Grid2x2Layout photos={photos} frame={frame} background={background} />;
    case 'grid-1-3':
      return <FeaturedLayout photos={photos} frame={frame} background={background} />;
    case 'grid-2-1':
      return <DuoLayout photos={photos} frame={frame} background={background} />;
    case 'single':
      return <SingleLayout photos={photos} frame={frame} background={background} />;
    default:
      return <StripLayout photos={photos} frame={frame} background={background} />;
  }
}

// ── Root component ────────────────────────────────────────────────────────────

/**
 * Displays the completed photo output using the selected layout,
 * with download and retake actions.
 */
export default function PhotoStrip({
  photos,
  frame,
  background,
  layout,
  onDownload,
  onRetake,
}: PhotoStripProps) {
  const isWide = layout.id === 'grid-2x2' || layout.id === 'grid-2-1' || layout.id === 'grid-1-3' || layout.id === 'single';

  const stripContent = frame.id === 'newspaper' ? (
    <NewspaperLayout
      photoCount={layout.photoCount}
      capturedPhotos={photos}
      background={background}
      isCapturing={false}
      countdown={null}
      onCapture={() => {}}
    />
  ) : (
    <div
      className={`${styles.strip} ${isWide ? styles.stripWide : ''} ${frame.stripClass ?? ''}`}
      style={{
        background: frame.stripBg,
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 2px ${frame.borderColor}`,
      }}
    >
      <StripDecoration frame={frame} />
      <PhotoGrid photos={photos} frame={frame} background={background} layoutId={layout.id} />
      <StripFooter frame={frame} />
    </div>
  );

  return (
    <div className={styles.container}>
      {stripContent}
      <div className={styles.actions}>
        <button
          className={styles.downloadButton}
          onClick={onDownload}
          style={{
            background: `linear-gradient(135deg, ${frame.borderColor}, ${frame.textColor})`,
            color: frame.bgColor,
            boxShadow: `0 4px 16px ${frame.borderColor}66`,
          }}
        >
          💾 Download
        </button>
        <button className={styles.retakeButton} onClick={onRetake}>
          🔄 Foto Ulang
        </button>
      </div>
    </div>
  );
}
