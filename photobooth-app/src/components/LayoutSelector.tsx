import type { GridLayout } from '../types';
import { layouts } from '../data/layouts';
import styles from './LayoutSelector.module.css';

interface LayoutSelectorProps {
  selectedLayout: GridLayout;
  onSelect: (layout: GridLayout) => void;
}

/**
 * Visual grid layout picker — shows a thumbnail diagram of each layout
 * so users can see the arrangement before shooting.
 */
export default function LayoutSelector({ selectedLayout, onSelect }: LayoutSelectorProps) {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.label}>📐 Layout Grid</h3>
      <div className={styles.grid}>
        {layouts.map(layout => (
          <LayoutCard
            key={layout.id}
            layout={layout}
            isSelected={selectedLayout.id === layout.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

function LayoutCard({
  layout,
  isSelected,
  onSelect,
}: {
  layout: GridLayout;
  isSelected: boolean;
  onSelect: (layout: GridLayout) => void;
}) {
  return (
    <button
      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
      onClick={() => onSelect(layout)}
      aria-pressed={isSelected}
      title={layout.description}
    >
      <LayoutDiagram layoutId={layout.id} photoCount={layout.photoCount} />
      <span className={styles.cardName}>{layout.name}</span>
      <span className={styles.cardDesc}>{layout.description}</span>
    </button>
  );
}

/** Renders a small SVG diagram showing the photo slot arrangement. */
function LayoutDiagram({
  layoutId,
  photoCount,
}: {
  layoutId: string;
  photoCount: number;
}) {
  const W = 60;
  const H = 60;
  const GAP = 3;
  const RADIUS = 2;
  const slotColor = 'rgba(255,255,255,0.25)';

  const slots = getSlots(layoutId, photoCount, W, H, GAP);

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className={styles.diagram}
      aria-hidden="true"
    >
      {slots.map((slot, i) => (
        <rect
          key={i}
          x={slot.x}
          y={slot.y}
          width={slot.w}
          height={slot.h}
          rx={RADIUS}
          fill={slotColor}
        />
      ))}
    </svg>
  );
}

interface SlotRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function getSlots(layoutId: string, photoCount: number, W: number, H: number, GAP: number): SlotRect[] {
  switch (layoutId) {
    case 'strip-4':
    case 'strip-3': {
      const slotH = (H - GAP * (photoCount - 1)) / photoCount;
      return Array.from({ length: photoCount }, (_, i) => ({
        x: 8,
        y: i * (slotH + GAP),
        w: W - 16,
        h: slotH,
      }));
    }

    case 'grid-2x2': {
      const half = (W - GAP) / 2;
      return [
        { x: 0,          y: 0,          w: half, h: half },
        { x: half + GAP, y: 0,          w: half, h: half },
        { x: 0,          y: half + GAP, w: half, h: half },
        { x: half + GAP, y: half + GAP, w: half, h: half },
      ];
    }

    case 'grid-1-3': {
      const bigH = H * 0.55;
      const smallH = H - bigH - GAP;
      const thirdW = (W - GAP * 2) / 3;
      return [
        { x: 0, y: 0, w: W, h: bigH },
        { x: 0,                   y: bigH + GAP, w: thirdW, h: smallH },
        { x: thirdW + GAP,        y: bigH + GAP, w: thirdW, h: smallH },
        { x: (thirdW + GAP) * 2,  y: bigH + GAP, w: thirdW, h: smallH },
      ];
    }

    case 'grid-2-1': {
      const half = (W - GAP) / 2;
      return [
        { x: 0,          y: 8, w: half, h: H - 16 },
        { x: half + GAP, y: 8, w: half, h: H - 16 },
      ];
    }

    case 'single':
      return [{ x: 4, y: 4, w: W - 8, h: H - 8 }];

    default:
      return [];
  }
}
