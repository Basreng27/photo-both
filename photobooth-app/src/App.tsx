import { useState, useRef, useCallback } from 'react';
import type { AppState, Frame, Background } from './types';
import { frames } from './data/frames';
import { backgrounds } from './data/backgrounds';
import { useCountdown } from './hooks/useCountdown';
import { downloadPhotoStrip } from './utils/canvasDownload';
import { TOTAL_PHOTOS, NEXT_PHOTO_DELAY_MS, RESULT_TRANSITION_DELAY_MS } from './constants';
import Camera from './components/Camera';
import FrameSelector from './components/FrameSelector';
import BackgroundSelector from './components/BackgroundSelector';
import PhotoStrip from './components/PhotoStrip';
import styles from './App.module.css';

const PREVIEW_EMOJIS = ['😊', '😄', '🤩', '😎'] as const;

// ── Sub-views ────────────────────────────────────────────────────────────────

interface SetupViewProps {
  selectedFrame: Frame;
  selectedBackground: Background;
  onFrameSelect: (frame: Frame) => void;
  onBackgroundSelect: (bg: Background) => void;
  onStart: () => void;
}

function SetupView({
  selectedFrame,
  selectedBackground,
  onFrameSelect,
  onBackgroundSelect,
  onStart,
}: SetupViewProps) {
  return (
    <div className={styles.setupContainer}>
      <div className={styles.selectorPanel}>
        <FrameSelector selectedFrame={selectedFrame} onSelect={onFrameSelect} />
        <BackgroundSelector selectedBackground={selectedBackground} onSelect={onBackgroundSelect} />
      </div>

      <FramePreview frame={selectedFrame} background={selectedBackground} />

      <button className={styles.startButton} onClick={onStart}>
        📸 Mulai Foto!
      </button>
    </div>
  );
}

function FramePreview({
  frame,
  background,
}: {
  frame: Frame;
  background: Background;
}) {
  return (
    <div className={styles.previewPanel}>
      <p className={styles.previewLabel}>Preview Frame</p>
      <div
        className={styles.previewStrip}
        style={{
          background: frame.stripBg,
          boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 0 2px ${frame.borderColor}`,
        }}
      >
        <div className={styles.previewDecor} style={{ color: frame.textColor }}>
          {frame.cornerDecor} {frame.cornerDecor} {frame.cornerDecor}
        </div>

        {PREVIEW_EMOJIS.map((emoji, i) => (
          <div
            key={i}
            className={styles.previewSlot}
            style={{
              border: frame.borderStyle,
              ...(background.id !== 'none'
                ? background.style
                : { background: 'rgba(255,255,255,0.1)' }),
            }}
          >
            {emoji}
          </div>
        ))}

        <div className={styles.previewBrand} style={{ color: frame.textColor }}>
          ✨ PhotoBooth ✨
        </div>
      </div>
    </div>
  );
}

// ── Shooting view ─────────────────────────────────────────────────────────────

interface ShootingViewProps {
  photos: string[];
  selectedFrame: Frame;
  selectedBackground: Background;
  countdown: number | null;
  isCapturing: boolean;
  onCapture: (imageData: string) => void;
  onCancel: () => void;
}

function ShootingView({
  photos,
  selectedFrame,
  selectedBackground,
  countdown,
  isCapturing,
  onCapture,
  onCancel,
}: ShootingViewProps) {
  const capturedCount = photos.length;
  const progressLabel =
    capturedCount < TOTAL_PHOTOS
      ? `Foto ${capturedCount + 1} dari ${TOTAL_PHOTOS}`
      : 'Selesai! 🎉';

  return (
    <div className={styles.shootingContainer}>
      <ProgressBar
        total={TOTAL_PHOTOS}
        doneCount={capturedCount}
        frame={selectedFrame}
        label={progressLabel}
      />

      <div
        className={styles.cameraWrapper}
        style={{
          border: `4px solid ${selectedFrame.borderColor}`,
          boxShadow: `0 0 30px ${selectedFrame.borderColor}44`,
        }}
      >
        <Camera
          selectedBackground={selectedBackground}
          isCapturing={isCapturing}
          countdown={countdown}
          onCapture={onCapture}
        />
      </div>

      {photos.length > 0 && (
        <ThumbnailRow photos={photos} frame={selectedFrame} />
      )}

      <button className={styles.cancelButton} onClick={onCancel}>
        ✕ Batal
      </button>
    </div>
  );
}

function ProgressBar({
  total,
  doneCount,
  frame,
  label,
}: {
  total: number;
  doneCount: number;
  frame: Frame;
  label: string;
}) {
  return (
    <div className={styles.progressBar}>
      {Array.from({ length: total }, (_, i) => {
        const isDone = i < doneCount;
        const isActive = i === doneCount;
        const dotClass = isDone
          ? `${styles.progressDot} ${styles.progressDotDone}`
          : isActive
          ? `${styles.progressDot} ${styles.progressDotActive}`
          : `${styles.progressDot} ${styles.progressDotPending}`;

        return (
          <div
            key={i}
            className={dotClass}
            style={
              isDone
                ? {
                    background: `linear-gradient(135deg, ${frame.borderColor}, ${frame.textColor})`,
                    boxShadow: `0 0 10px ${frame.borderColor}88`,
                  }
                : undefined
            }
          >
            {isDone ? '✓' : i + 1}
          </div>
        );
      })}
      <span className={styles.progressLabel}>{label}</span>
    </div>
  );
}

function ThumbnailRow({ photos, frame }: { photos: string[]; frame: Frame }) {
  return (
    <div className={styles.thumbnailRow}>
      {photos.map((photo, i) => (
        <div
          key={i}
          className={styles.thumbnail}
          style={{
            border: `2px solid ${frame.borderColor}`,
            boxShadow: `0 0 8px ${frame.borderColor}66`,
          }}
        >
          <img
            src={photo}
            alt={`Thumbnail ${i + 1}`}
            className={styles.thumbnailImage}
          />
        </div>
      ))}
    </div>
  );
}

// ── Result view ───────────────────────────────────────────────────────────────

interface ResultViewProps {
  photos: string[];
  frame: Frame;
  background: Background;
  onDownload: () => void;
  onRetake: () => void;
}

function ResultView({ photos, frame, background, onDownload, onRetake }: ResultViewProps) {
  return (
    <div className={styles.resultContainer}>
      <div className={styles.resultPanel}>
        <h2 className={styles.resultTitle}>🎉 Foto Kamu Siap!</h2>
        <p className={styles.resultSubtitle}>
          Download atau foto ulang dengan frame berbeda
        </p>
        <PhotoStrip
          photos={photos}
          frame={frame}
          background={background}
          onDownload={onDownload}
          onRetake={onRetake}
        />
      </div>
    </div>
  );
}

// ── Root component ────────────────────────────────────────────────────────────

export default function App() {
  const [appState, setAppState] = useState<AppState>('setup');
  const [selectedFrame, setSelectedFrame] = useState<Frame>(frames[0]);
  const [selectedBackground, setSelectedBackground] = useState<Background>(backgrounds[0]);
  const [photos, setPhotos] = useState<string[]>([]);

  const capturedPhotosRef = useRef<string[]>([]);
  const { countdown, isCapturing, startCountdown } = useCountdown();

  const startSession = useCallback(() => {
    capturedPhotosRef.current = [];
    setPhotos([]);
    setAppState('shooting');
    setTimeout(startCountdown, 500);
  }, [startCountdown]);

  const handleCapture = useCallback(
    (imageData: string) => {
      const updated = [...capturedPhotosRef.current, imageData];
      capturedPhotosRef.current = updated;
      setPhotos(updated);

      const allDone = updated.length >= TOTAL_PHOTOS;
      if (allDone) {
        setTimeout(() => setAppState('result'), RESULT_TRANSITION_DELAY_MS);
      } else {
        setTimeout(startCountdown, NEXT_PHOTO_DELAY_MS);
      }
    },
    [startCountdown]
  );

  const handleDownload = useCallback(() => {
    downloadPhotoStrip(photos, selectedFrame);
  }, [photos, selectedFrame]);

  const handleRetake = useCallback(() => {
    capturedPhotosRef.current = [];
    setPhotos([]);
    setAppState('setup');
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>📸 PhotoBooth</h1>
        <p className={styles.subtitle}>
          Ambil {TOTAL_PHOTOS} foto keren dengan frame &amp; background pilihan kamu!
        </p>
      </header>

      {appState === 'setup' && (
        <SetupView
          selectedFrame={selectedFrame}
          selectedBackground={selectedBackground}
          onFrameSelect={setSelectedFrame}
          onBackgroundSelect={setSelectedBackground}
          onStart={startSession}
        />
      )}

      {appState === 'shooting' && (
        <ShootingView
          photos={photos}
          selectedFrame={selectedFrame}
          selectedBackground={selectedBackground}
          countdown={countdown}
          isCapturing={isCapturing}
          onCapture={handleCapture}
          onCancel={handleRetake}
        />
      )}

      {appState === 'result' && (
        <ResultView
          photos={photos}
          frame={selectedFrame}
          background={selectedBackground}
          onDownload={handleDownload}
          onRetake={handleRetake}
        />
      )}

      <footer className={styles.footer}>Made with ❤️ · PhotoBooth App</footer>
    </div>
  );
}
