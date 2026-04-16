import type { Frame, GridLayout } from '../types';
import { STRIP_PADDING, STRIP_GAP, STRIP_HEADER_HEIGHT, STRIP_FOOTER_HEIGHT } from '../constants';

// ── Shared helpers ────────────────────────────────────────────────────────────

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

function fillBackground(
  ctx: CanvasRenderingContext2D,
  frame: Frame,
  width: number,
  height: number
): void {
  const [colorStart, colorEnd] = extractGradientColors(frame.stripBg);
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(1, colorEnd);
  ctx.fillStyle = gradient;
  ctx.roundRect(0, 0, width, height, 12);
  ctx.fill();
}

function strokeBorder(
  ctx: CanvasRenderingContext2D,
  frame: Frame,
  width: number,
  height: number
): void {
  ctx.strokeStyle = frame.borderColor;
  ctx.lineWidth = 6;
  ctx.roundRect(3, 3, width - 6, height - 6, 10);
  ctx.stroke();
}

function drawCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  color: string,
  alpha = 1
): void {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y);
  ctx.globalAlpha = 1;
}

function drawDecoration(
  ctx: CanvasRenderingContext2D,
  frame: Frame,
  centerX: number,
  y: number,
  fontSize: number
): void {
  const decor = `${frame.cornerDecor} ${frame.cornerDecor} ${frame.cornerDecor}`;
  drawCenteredText(ctx, decor, centerX, y, `bold ${fontSize}px Nunito, sans-serif`, frame.textColor);
}

function drawPhotoBadge(
  ctx: CanvasRenderingContext2D,
  index: number,
  slotX: number,
  slotY: number,
  slotW: number,
  slotH: number
): void {
  const bx = slotX + slotW - 18;
  const by = slotY + slotH - 18;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.beginPath();
  ctx.arc(bx, by, 14, 0, Math.PI * 2);
  ctx.fill();
  drawCenteredText(ctx, `${index + 1}`, bx, by + 5, 'bold 14px Nunito, sans-serif', '#fff');
}

async function drawPhotoInSlot(
  ctx: CanvasRenderingContext2D,
  src: string,
  index: number,
  x: number,
  y: number,
  w: number,
  h: number,
  frame: Frame
): Promise<void> {
  const img = await loadImage(src);
  ctx.strokeStyle = frame.borderColor;
  ctx.lineWidth = 4;
  ctx.strokeRect(x - 2, y - 2, w + 4, h + 4);
  ctx.drawImage(img, x, y, w, h);
  drawPhotoBadge(ctx, index, x, y, w, h);
}

function drawFooterText(
  ctx: CanvasRenderingContext2D,
  frame: Frame,
  centerX: number,
  startY: number
): void {
  const dateStr = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  drawDecoration(ctx, frame, centerX, startY, 20);
  drawCenteredText(ctx, '✨ PhotoBooth ✨', centerX, startY + 24, 'bold 18px Pacifico, cursive', frame.textColor);
  drawCenteredText(ctx, dateStr, centerX, startY + 42, '13px Nunito, sans-serif', frame.textColor, 0.6);
}

function triggerDownload(canvas: HTMLCanvasElement): void {
  const link = document.createElement('a');
  link.download = `photobooth-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ── Layout-specific renderers ─────────────────────────────────────────────────

interface CanvasSize {
  width: number;
  height: number;
}

/** Vertical strip: 3 or 4 photos stacked. */
async function renderStrip(
  ctx: CanvasRenderingContext2D,
  photos: string[],
  frame: Frame,
  size: CanvasSize
): Promise<void> {
  const { width, height } = size;
  const photoW = width - STRIP_PADDING * 2;
  const photoH = Math.round(photoW * (3 / 4));
  const contentH = photos.length * (photoH + STRIP_GAP) - STRIP_GAP;
  const offsetY = Math.round((height - STRIP_HEADER_HEIGHT - STRIP_FOOTER_HEIGHT - contentH) / 2);

  fillBackground(ctx, frame, width, height);
  strokeBorder(ctx, frame, width, height);
  drawDecoration(ctx, frame, width / 2, STRIP_PADDING + 28, 22);

  for (let i = 0; i < photos.length; i++) {
    const y = STRIP_HEADER_HEIGHT + offsetY + i * (photoH + STRIP_GAP);
    await drawPhotoInSlot(ctx, photos[i], i, STRIP_PADDING, y, photoW, photoH, frame);
  }

  const footerY = height - STRIP_FOOTER_HEIGHT + 8;
  drawFooterText(ctx, frame, width / 2, footerY);
}

/** 2×2 square grid. */
async function renderGrid2x2(
  ctx: CanvasRenderingContext2D,
  photos: string[],
  frame: Frame,
  size: CanvasSize
): Promise<void> {
  const { width, height } = size;
  const innerW = width - STRIP_PADDING * 2;
  const innerH = height - STRIP_HEADER_HEIGHT - STRIP_FOOTER_HEIGHT - STRIP_PADDING * 2;
  const cellW = Math.floor((innerW - STRIP_GAP) / 2);
  const cellH = Math.floor((innerH - STRIP_GAP) / 2);

  fillBackground(ctx, frame, width, height);
  strokeBorder(ctx, frame, width, height);
  drawDecoration(ctx, frame, width / 2, STRIP_PADDING + 28, 22);

  const positions = [
    { col: 0, row: 0 },
    { col: 1, row: 0 },
    { col: 0, row: 1 },
    { col: 1, row: 1 },
  ];

  for (let i = 0; i < photos.length; i++) {
    const { col, row } = positions[i];
    const x = STRIP_PADDING + col * (cellW + STRIP_GAP);
    const y = STRIP_HEADER_HEIGHT + STRIP_PADDING + row * (cellH + STRIP_GAP);
    await drawPhotoInSlot(ctx, photos[i], i, x, y, cellW, cellH, frame);
  }

  const footerY = height - STRIP_FOOTER_HEIGHT + 8;
  drawFooterText(ctx, frame, width / 2, footerY);
}

/** 1 large photo on top + 3 small photos below. */
async function renderFeatured(
  ctx: CanvasRenderingContext2D,
  photos: string[],
  frame: Frame,
  size: CanvasSize
): Promise<void> {
  const { width, height } = size;
  const innerW = width - STRIP_PADDING * 2;
  const innerH = height - STRIP_HEADER_HEIGHT - STRIP_FOOTER_HEIGHT - STRIP_PADDING * 2;
  const bigH = Math.floor(innerH * 0.55);
  const smallH = innerH - bigH - STRIP_GAP;
  const smallW = Math.floor((innerW - STRIP_GAP * 2) / 3);
  const bigY = STRIP_HEADER_HEIGHT + STRIP_PADDING;
  const smallY = bigY + bigH + STRIP_GAP;

  fillBackground(ctx, frame, width, height);
  strokeBorder(ctx, frame, width, height);
  drawDecoration(ctx, frame, width / 2, STRIP_PADDING + 28, 22);

  // Big photo
  await drawPhotoInSlot(ctx, photos[0], 0, STRIP_PADDING, bigY, innerW, bigH, frame);

  // 3 small photos
  for (let i = 0; i < 3; i++) {
    const x = STRIP_PADDING + i * (smallW + STRIP_GAP);
    await drawPhotoInSlot(ctx, photos[i + 1], i + 1, x, smallY, smallW, smallH, frame);
  }

  const footerY = height - STRIP_FOOTER_HEIGHT + 8;
  drawFooterText(ctx, frame, width / 2, footerY);
}

/** 2 photos side by side. */
async function renderDuo(
  ctx: CanvasRenderingContext2D,
  photos: string[],
  frame: Frame,
  size: CanvasSize
): Promise<void> {
  const { width, height } = size;
  const innerW = width - STRIP_PADDING * 2;
  const innerH = height - STRIP_HEADER_HEIGHT - STRIP_FOOTER_HEIGHT - STRIP_PADDING * 2;
  const cellW = Math.floor((innerW - STRIP_GAP) / 2);

  fillBackground(ctx, frame, width, height);
  strokeBorder(ctx, frame, width, height);
  drawDecoration(ctx, frame, width / 2, STRIP_PADDING + 28, 22);

  for (let i = 0; i < 2; i++) {
    const x = STRIP_PADDING + i * (cellW + STRIP_GAP);
    const y = STRIP_HEADER_HEIGHT + STRIP_PADDING;
    await drawPhotoInSlot(ctx, photos[i], i, x, y, cellW, innerH, frame);
  }

  const footerY = height - STRIP_FOOTER_HEIGHT + 8;
  drawFooterText(ctx, frame, width / 2, footerY);
}

/** Single photo with full frame. */
async function renderSingle(
  ctx: CanvasRenderingContext2D,
  photos: string[],
  frame: Frame,
  size: CanvasSize
): Promise<void> {
  const { width, height } = size;
  const innerW = width - STRIP_PADDING * 2;
  const innerH = height - STRIP_HEADER_HEIGHT - STRIP_FOOTER_HEIGHT - STRIP_PADDING * 2;

  fillBackground(ctx, frame, width, height);
  strokeBorder(ctx, frame, width, height);
  drawDecoration(ctx, frame, width / 2, STRIP_PADDING + 28, 22);
  await drawPhotoInSlot(ctx, photos[0], 0, STRIP_PADDING, STRIP_HEADER_HEIGHT + STRIP_PADDING, innerW, innerH, frame);

  const footerY = height - STRIP_FOOTER_HEIGHT + 8;
  drawFooterText(ctx, frame, width / 2, footerY);
}

// ── Canvas size calculator ────────────────────────────────────────────────────

const BASE_WIDTH = 448;

function getCanvasSize(layout: GridLayout): CanvasSize {
  const width = BASE_WIDTH;
  const height = Math.round(width / layout.aspectRatio);
  return { width, height };
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Renders the photo output onto a canvas using the selected layout,
 * then triggers a PNG download.
 */
export async function downloadPhotoStrip(
  photos: string[],
  frame: Frame,
  layout: GridLayout
): Promise<void> {
  const size = getCanvasSize(layout);
  const canvas = document.createElement('canvas');
  canvas.width = size.width;
  canvas.height = size.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  switch (layout.id) {
    case 'strip-4':
    case 'strip-3':
      await renderStrip(ctx, photos, frame, size);
      break;
    case 'grid-2x2':
      await renderGrid2x2(ctx, photos, frame, size);
      break;
    case 'grid-1-3':
      await renderFeatured(ctx, photos, frame, size);
      break;
    case 'grid-2-1':
      await renderDuo(ctx, photos, frame, size);
      break;
    case 'single':
      await renderSingle(ctx, photos, frame, size);
      break;
    default:
      await renderStrip(ctx, photos, frame, size);
  }

  triggerDownload(canvas);
}
