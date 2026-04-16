import type { Frame, Background } from '../types';
import styles from './PhotoStrip.module.css';

interface PhotoStripProps {
  photos: string[];
  frame: Frame;
  background: Background;
  onDownload: () => void;
  onRetake: () => void;
}

function StripDecoration({ frame }: { frame: Frame }) {
  return (
    <div className={styles.decoration} style={{ color: frame.textColor }}>
      {frame.cornerDecor} {frame.cornerDecor} {frame.cornerDecor}
    </div>
  );
}

function PhotoSlot({
  photo,
  index,
  background,
  frame,
}: {
  photo: string;
  index: number;
  background: Background;
  frame: Frame;
}) {
  return (
    <div className={styles.photoSlot} style={{ border: frame.borderStyle }}>
      {background.id !== 'none' && (
        <div
          className={styles.backgroundOverlay}
          style={background.style}
          aria-hidden="true"
        />
      )}
      <img
        src={photo}
        alt={`Foto ${index + 1}`}
        className={styles.photo}
      />
      <div className={styles.photoBadge}>{index + 1}</div>
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
      <StripDecoration frame={frame} />
      <div className={styles.footerBrand} style={{ color: frame.textColor }}>
        ✨ PhotoBooth ✨
      </div>
      <div className={styles.footerDate} style={{ color: frame.textColor }}>
        {dateStr}
      </div>
    </div>
  );
}

/**
 * Displays the completed photo strip with download and retake actions.
 */
export default function PhotoStrip({
  photos,
  frame,
  background,
  onDownload,
  onRetake,
}: PhotoStripProps) {
  return (
    <div className={styles.container}>
      <div
        className={styles.strip}
        style={{
          background: frame.stripBg,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 2px ${frame.borderColor}`,
        }}
      >
        <StripDecoration frame={frame} />

        {photos.map((photo, index) => (
          <PhotoSlot
            key={index}
            photo={photo}
            index={index}
            background={background}
            frame={frame}
          />
        ))}

        <StripFooter frame={frame} />
      </div>

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
