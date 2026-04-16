import { useState, useRef, useCallback } from 'react';
import type { Frame, Background, GridLayout } from './types';
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
import LiveStripPreview from './components/LiveStripPreview';
import ShootingStripPreview from './components/ShootingStripPreview';
import FrameSelector from './components/FrameSelector';
import BackgroundSelector from './components/BackgroundSelector';
import LayoutSelector from './components/LayoutSelector';
import PhotoStrip from './components/PhotoStrip';
import styles from './App.module.css';

type AppState = 'idle' | 'shooting' | 'result';

// ── Progress bar ──────────────────────────────────────────────────────────────

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
  const [appState, setAppState] = useState<AppState>('idle');
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
    setAppState('idle');
  }, []);

  const capturedCount = photos.length;
  const progressLabel =
    capturedCount < selectedLayout.photoCount
      ? `Foto ${capturedCount + 1} dari ${selectedLayout.photoCount}`
      : 'Selesai! 🎉';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>📸 PhotoBooth</h1>
        <p className={styles.subtitle}>
          Pilih layout, frame &amp; background — kamera langsung preview!
        </p>
      </header>

      {/* ── IDLE: camera live inside the actual strip frame ── */}
      {appState === 'idle' && (
        <div className={styles.idleLayout}>
          {/* Left: live strip preview */}
          <div className={styles.idleCameraCol}>
            <LiveStripPreview
              frame={selectedFrame}
              background={selectedBackground}
              layout={selectedLayout}
              isCapturing={false}
              countdown={null}
              onCapture={() => {}}
            />
            <button className={styles.startButton} onClick={startSession}>
              📸 Mulai Foto! &nbsp;·&nbsp; {selectedLayout.photoCount} foto
            </button>
          </div>

          {/* Right: selectors */}
          <div className={styles.idleSelectorCol}>
            <div className={styles.selectorPanel}>
              <LayoutSelector selectedLayout={selectedLayout} onSelect={setSelectedLayout} />
              <FrameSelector selectedFrame={selectedFrame} onSelect={setSelectedFrame} />
              <BackgroundSelector
                selectedBackground={selectedBackground}
                onSelect={setSelectedBackground}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── SHOOTING: strip with captured photos + live camera in next slot ── */}
      {appState === 'shooting' && (
        <div className={styles.shootingContainer}>
          <ProgressBar
            total={selectedLayout.photoCount}
            doneCount={capturedCount}
            frame={selectedFrame}
            label={progressLabel}
          />

          <ShootingStripPreview
            frame={selectedFrame}
            background={selectedBackground}
            layout={selectedLayout}
            capturedPhotos={photos}
            isCapturing={isCapturing}
            countdown={countdown}
            onCapture={handleCapture}
          />

          <button className={styles.cancelButton} onClick={handleRetake}>
            ✕ Batal
          </button>
        </div>
      )}

      {/* ── RESULT ── */}
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
