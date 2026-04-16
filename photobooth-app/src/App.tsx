import { useState, useRef, useCallback } from 'react';
import type { AppState, Frame, Background, GridLayout } from './types';
import { frames } from './data/frames';
import { backgrounds } from './data/backgrounds';
import { layouts } from './data/layouts';
import { useCountdown } from './hooks/useCountdown';
import { downloadPhotoStrip } from './utils/canvasDownload';
import {
  NEXT_PHOTO_DELAY_MS,
  RESULT_TRANSITION_DELAY_MS,
  SESSION_START_DELAY_MS,
} from './constants';
import Camera from './components/Camera';
import FrameSelector from './components/FrameSelector';
import BackgroundSelector from './components/BackgroundSelector';
import LayoutSelector from './components/LayoutSelector';
import PhotoStrip from './components/PhotoStrip';
import styles from './App.module.css';

const PREVIEW_EMOJIS = ['😊', '😄', '🤩', '😎'] as const;

// ── Setup view ────────────────────────────────────────────────────────────────

interface SetupViewProps {
  selectedFrame: Frame;
  selectedBackground: Background;
  selectedLayout: GridLayout;
  onFrameSelect: (frame: Frame) => void;
  onBackgroundSelect: (bg: Background) => void;
  onLayoutSelect: (layout: GridLayout) => void;
  onStart: () => void;
}

function SetupView({
  selectedFrame,
  selectedBackground,
  selectedLayout,
  onFrameSelect,
  onBackgroundSelect,
  onLayoutSelect,
  onStart,
}: SetupViewProps) {
  return (
    <div className={styles.setupContainer}>
      <div className={styles.selectorPanel}>
        <LayoutSelector selectedLayout={selectedLayout} onSelect={onLayoutSelect} />
        <FrameSelector selectedFrame={selectedFrame} onSelect={onFrameSelect} />
        <BackgroundSelector selectedBackground={selectedBackground} onSelect={onBackgroundSelect} />
      </div>

      <FramePreview
        frame={selectedFrame}
        background={selectedBackground}
        layout={selectedLayout}
      />

      <button className={styles.startButton} onClick={onStart}>
        📸 Mulai Foto! ({selectedLayout.photoCount} foto)
      </button>
    </div>
  );
}

function FramePreview({
  frame,
  background,
  layout,
}: {
  frame: Frame;
  background: Background;
  layout: GridLayout;
}) {
  const slotCount = Math.min(layout.photoCount, PREVIEW_EMOJIS.length);
  const isWide = layout.id !== 'strip-4' && layout.id !== 'strip-3';

  return (
    <div className={styles.previewPanel}>
      <p className={styles.previewLabel}>
        Preview — {layout.name}
      </p>
      <div
        className={`${styles.previewStrip} ${isWide ? styles.previewStripWide : ''}`}
        style={{
          background: frame.stripBg,
          boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 0 2px ${frame.borderColor}`,
        }}
      >
        <div className={styles.previewDecor} style={{ color: frame.textColor }}>
          {frame.cornerDecor} {frame.cornerDecor} {frame.cornerDecor}
        </div>

        <PreviewSlots
          layoutId={layout.id}
          slotCount={slotCount}
          frame={frame}
          background={background}
        />

        <div className={styles.previewBrand} style={{ color: frame.textColor }}>
          ✨ PhotoBooth ✨
        </div>
      </div>
    </div>
  );
}

function PreviewSlots({
  layoutId,
  slotCount,
  frame,
  background,
}: {
  layoutId: string;
  slotCount: number;
  frame: Frame;
  background: Background;
}) {
  const slotStyle = {
    border: frame.borderStyle,
    ...(background.id !== 'none'
      ? background.style
      : { background: 'rgba(255,255,255,0.1)' }),
  };

  if (layoutId === 'grid-2x2') {
    return (
      <div className={styles.previewGrid2x2}>
        {PREVIEW_EMOJIS.slice(0, slotCount).map((emoji, i) => (
          <div key={i} className={`${styles.previewSlot} ${styles.previewSlotSquare}`} style={slotStyle}>
            {emoji}
          </div>
        ))}
      </div>
    );
  }

  if (layoutId === 'grid-1-3') {
    return (
      <div className={styles.previewFeatured}>
        <div className={`${styles.previewSlot} ${styles.previewSlotWide}`} style={slotStyle}>
          {PREVIEW_EMOJIS[0]}
        </div>
        <div className={styles.previewGrid3}>
          {PREVIEW_EMOJIS.slice(1, 4).map((emoji, i) => (
            <div key={i} className={`${styles.previewSlot} ${styles.previewSlotSquare}`} style={slotStyle}>
              {emoji}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (layoutId === 'grid-2-1') {
    return (
      <div className={styles.previewDuo}>
        {PREVIEW_EMOJIS.slice(0, 2).map((emoji, i) => (
          <div key={i} className={`${styles.previewSlot} ${styles.previewSlotTall}`} style={slotStyle}>
            {emoji}
          </div>
        ))}
      </div>
    );
  }

  if (layoutId === 'single') {
    return (
      <div className={`${styles.previewSlot} ${styles.previewSlotWide}`} style={slotStyle}>
        {PREVIEW_EMOJIS[0]}
      </div>
    );
  }

  // Default: vertical strip
  return (
    <>
      {PREVIEW_EMOJIS.slice(0, slotCount).map((emoji, i) => (
        <div key={i} className={styles.previewSlot} style={slotStyle}>
          {emoji}
        </div>
      ))}
    </>
  );
}

// ── Shooting view ─────────────────────────────────────────────────────────────

interface ShootingViewProps {
  photos: string[];
  totalPhotos: number;
  selectedFrame: Frame;
  selectedBackground: Background;
  countdown: number | null;
  isCapturing: boolean;
  onCapture: (imageData: string) => void;
  onCancel: () => void;
}

function ShootingView({
  photos,
  totalPhotos,
  selectedFrame,
  selectedBackground,
  countdown,
  isCapturing,
  onCapture,
  onCancel,
}: ShootingViewProps) {
  const capturedCount = photos.length;
  const progressLabel =
    capturedCount < totalPhotos
      ? `Foto ${capturedCount + 1} dari ${totalPhotos}`
      : 'Selesai! 🎉';

  return (
    <div className={styles.shootingContainer}>
      <ProgressBar
        total={totalPhotos}
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
  layout: GridLayout;
  onDownload: () => void;
  onRetake: () => void;
}

function ResultView({ photos, frame, background, layout, onDownload, onRetake }: ResultViewProps) {
  return (
    <div className={styles.resultContainer}>
      <div className={styles.resultPanel}>
        <h2 className={styles.resultTitle}>🎉 Foto Kamu Siap!</h2>
        <p className={styles.resultSubtitle}>
          Download atau foto ulang dengan layout berbeda
        </p>
        <PhotoStrip
          photos={photos}
          frame={frame}
          background={background}
          layout={layout}
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
  const [selectedLayout, setSelectedLayout] = useState<GridLayout>(layouts[0]);
  const [photos, setPhotos] = useState<string[]>([]);

  const capturedPhotosRef = useRef<string[]>([]);
  const { countdown, isCapturing, startCountdown } = useCountdown();

  const startSession = useCallback(() => {
    capturedPhotosRef.current = [];
    setPhotos([]);
    setAppState('shooting');
    setTimeout(startCountdown, SESSION_START_DELAY_MS);
  }, [startCountdown]);

  const handleCapture = useCallback(
    (imageData: string) => {
      const updated = [...capturedPhotosRef.current, imageData];
      capturedPhotosRef.current = updated;
      setPhotos(updated);

      const allDone = updated.length >= selectedLayout.photoCount;
      if (allDone) {
        setTimeout(() => setAppState('result'), RESULT_TRANSITION_DELAY_MS);
      } else {
        setTimeout(startCountdown, NEXT_PHOTO_DELAY_MS);
      }
    },
    [startCountdown, selectedLayout.photoCount]
  );

  const handleDownload = useCallback(() => {
    downloadPhotoStrip(photos, selectedFrame, selectedLayout);
  }, [photos, selectedFrame, selectedLayout]);

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
          Pilih layout, frame &amp; background — lalu foto!
        </p>
      </header>

      {appState === 'setup' && (
        <SetupView
          selectedFrame={selectedFrame}
          selectedBackground={selectedBackground}
          selectedLayout={selectedLayout}
          onFrameSelect={setSelectedFrame}
          onBackgroundSelect={setSelectedBackground}
          onLayoutSelect={setSelectedLayout}
          onStart={startSession}
        />
      )}

      {appState === 'shooting' && (
        <ShootingView
          photos={photos}
          totalPhotos={selectedLayout.photoCount}
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
          layout={selectedLayout}
          onDownload={handleDownload}
          onRetake={handleRetake}
        />
      )}

      <footer className={styles.footer}>Made with ❤️ · PhotoBooth App</footer>
    </div>
  );
}
