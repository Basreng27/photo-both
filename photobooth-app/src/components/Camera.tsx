import type { Background } from '../types';
import { useCamera } from '../hooks/useCamera';
import { useEffect } from 'react';
import styles from './Camera.module.css';

interface CameraProps {
  selectedBackground: Background;
  isCapturing: boolean;
  countdown: number | null;
  onCapture: (imageData: string) => void;
}

function BackgroundOverlay({ background }: { background: Background }) {
  if (background.id === 'none') return null;
  return (
    <div
      className={styles.backgroundOverlay}
      style={background.style}
      aria-hidden="true"
    />
  );
}

function CountdownOverlay({ countdown }: { countdown: number | null }) {
  if (countdown === null) return null;
  return (
    <div className={styles.countdownOverlay}>
      <span className={styles.countdownNumber}>
        {countdown === 0 ? '📸' : countdown}
      </span>
    </div>
  );
}

function CameraError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className={styles.errorWrapper}>
      <span className={styles.errorIcon}>📷</span>
      <p className={styles.errorMessage}>{message}</p>
      <button className={styles.retryButton} onClick={onRetry}>
        Coba Lagi
      </button>
    </div>
  );
}

/**
 * Renders the live webcam feed with background overlay, countdown, and mirror toggle.
 * Delegates camera logic to the useCamera hook.
 */
export default function Camera({
  selectedBackground,
  isCapturing,
  countdown,
  onCapture,
}: CameraProps) {
  const { videoRef, canvasRef, error, mirrored, toggleMirror, retryCamera, captureFrame } =
    useCamera();

  useEffect(() => {
    if (!isCapturing) return;
    const imageData = captureFrame();
    if (imageData) onCapture(imageData);
  }, [isCapturing, captureFrame, onCapture]);

  if (error) {
    return <CameraError message={error} onRetry={retryCamera} />;
  }

  return (
    <div className={styles.wrapper}>
      <BackgroundOverlay background={selectedBackground} />

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`${styles.video} ${mirrored ? styles.videoMirrored : ''}`}
      />

      <CountdownOverlay countdown={countdown} />

      <button
        className={styles.mirrorButton}
        onClick={toggleMirror}
        title="Toggle mirror"
        aria-label="Toggle mirror"
      >
        🔄
      </button>

      <canvas ref={canvasRef} className={styles.hiddenCanvas} />
    </div>
  );
}
