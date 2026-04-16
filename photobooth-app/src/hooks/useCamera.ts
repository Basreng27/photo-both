import { useRef, useState, useEffect, useCallback } from 'react';

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  error: string | null;
  mirrored: boolean;
  toggleMirror: () => void;
  retryCamera: () => void;
  captureFrame: () => string | null;
}

const CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user',
  },
  audio: false,
};

const FALLBACK_WIDTH = 640;
const FALLBACK_HEIGHT = 480;
const JPEG_QUALITY = 0.95;

/**
 * Manages webcam access, mirror state, and frame capture.
 * Encapsulates all camera-related side effects.
 */
export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [mirrored, setMirrored] = useState(true);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError(null);
    } catch {
      setError('Tidak dapat mengakses kamera. Pastikan izin kamera sudah diberikan.');
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [startCamera]);

  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = video.videoWidth || FALLBACK_WIDTH;
    canvas.height = video.videoHeight || FALLBACK_HEIGHT;

    if (mirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (mirrored) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  }, [mirrored]);

  const toggleMirror = useCallback(() => {
    setMirrored(prev => !prev);
  }, []);

  return {
    videoRef,
    canvasRef,
    error,
    mirrored,
    toggleMirror,
    retryCamera: startCamera,
    captureFrame,
  };
}
