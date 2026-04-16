import type { Frame } from '../types';
import {
  TOTAL_PHOTOS,
  STRIP_PHOTO_WIDTH,
  STRIP_PHOTO_HEIGHT,
  STRIP_PADDING,
  STRIP_GAP,
  STRIP_HEADER_HEIGHT,
  STRIP_FOOTER_HEIGHT,
} from '../constants';

const STRIP_TOTAL_WIDTH = STRIP_PHOTO_WIDTH + STRIP_PADDING * 2;
const STRIP_TOTAL_HEIGHT =
  STRIP_HEADER_HEIGHT +
  (STRIP_PHOTO_HEIGHT + STRIP_GAP) * TOTAL_PHOTOS -
  STRIP_GAP +
  STRIP_FOOTER_HEIGHT +
  STRIP_PADDING * 2;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function extractGradientColors(stripBg: string): [string, string] {
  const colors = stripBg.match(/#[0-9a-fA-F]{6}/g);
  const first = colors?.[0] ?? '#1a1a1a';
  const second = colors?.[1] ?? first;
  return [first, second];
}

function drawBackground(ctx: CanvasRenderingContext2D, frame: Frame): void {
  const [colorStart, colorEnd] = extractGradientColors(frame.stripBg);
  const gradient = ctx.createLinearGradient(0, 0, 0, STRIP_TOTAL_HEIGHT);
  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(1, colorEnd);

  ctx.fillStyle = gradient;
  ctx.roundRect(0, 0, STRIP_TOTAL_WIDTH, STRIP_TOTAL_HEIGHT, 12);
  ctx.fill();
}

function drawBorder(ctx: CanvasRenderingContext2D, frame: Frame): void {
  ctx.strokeStyle = frame.borderColor;
  ctx.lineWidth = 6;
  ctx.roundRect(3, 3, STRIP_TOTAL_WIDTH - 6, STRIP_TOTAL_HEIGHT - 6, 10);
  ctx.stroke();
}

function drawDecoration(
  ctx: CanvasRenderingContext2D,
  frame: Frame,
  y: number,
  fontSize: number
): void {
  ctx.fillStyle = frame.textColor;
  ctx.font = `bold ${fontSize}px Nunito, sans-serif`;
  ctx.textAlign = 'center';
  const decor = `${frame.cornerDecor} ${frame.cornerDecor} ${frame.cornerDecor}`;
  ctx.fillText(decor, STRIP_TOTAL_WIDTH / 2, y);
}

function drawPhotoBadge(
  ctx: CanvasRenderingContext2D,
  index: number,
  photoY: number
): void {
  const badgeX = STRIP_PADDING + STRIP_PHOTO_WIDTH - 18;
  const badgeY = photoY + STRIP_PHOTO_HEIGHT - 18;

  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.beginPath();
  ctx.arc(badgeX, badgeY, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${index + 1}`, badgeX, badgeY + 5);
}

async function drawPhotos(
  ctx: CanvasRenderingContext2D,
  photos: string[],
  frame: Frame
): Promise<void> {
  for (let i = 0; i < photos.length; i++) {
    const img = await loadImage(photos[i]);
    const y = STRIP_HEADER_HEIGHT + STRIP_PADDING + i * (STRIP_PHOTO_HEIGHT + STRIP_GAP);

    ctx.strokeStyle = frame.borderColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(STRIP_PADDING - 2, y - 2, STRIP_PHOTO_WIDTH + 4, STRIP_PHOTO_HEIGHT + 4);
    ctx.drawImage(img, STRIP_PADDING, y, STRIP_PHOTO_WIDTH, STRIP_PHOTO_HEIGHT);

    drawPhotoBadge(ctx, i, y);
  }
}

function drawFooter(ctx: CanvasRenderingContext2D, frame: Frame): void {
  const footerY =
    STRIP_HEADER_HEIGHT +
    STRIP_PADDING +
    TOTAL_PHOTOS * (STRIP_PHOTO_HEIGHT + STRIP_GAP) -
    STRIP_GAP +
    16;

  drawDecoration(ctx, frame, footerY + 20, 20);

  ctx.font = 'bold 18px Pacifico, cursive';
  ctx.fillStyle = frame.textColor;
  ctx.textAlign = 'center';
  ctx.fillText('✨ PhotoBooth ✨', STRIP_TOTAL_WIDTH / 2, footerY + 44);

  const dateStr = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  ctx.font = '13px Nunito, sans-serif';
  ctx.globalAlpha = 0.6;
  ctx.fillText(dateStr, STRIP_TOTAL_WIDTH / 2, footerY + 62);
  ctx.globalAlpha = 1;
}

/**
 * Renders the photo strip onto a canvas and triggers a PNG download.
 */
export async function downloadPhotoStrip(photos: string[], frame: Frame): Promise<void> {
  const canvas = document.createElement('canvas');
  canvas.width = STRIP_TOTAL_WIDTH;
  canvas.height = STRIP_TOTAL_HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  drawBackground(ctx, frame);
  drawBorder(ctx, frame);
  drawDecoration(ctx, frame, STRIP_PADDING + 30, 24);
  await drawPhotos(ctx, photos, frame);
  drawFooter(ctx, frame);

  const link = document.createElement('a');
  link.download = `photobooth-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
