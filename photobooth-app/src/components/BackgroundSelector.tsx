import type { Background } from '../types';
import { backgrounds } from '../data/backgrounds';
import styles from './SelectorGroup.module.css';

interface BackgroundSelectorProps {
  selectedBackground: Background;
  onSelect: (background: Background) => void;
}

/**
 * Renders a pill-button list for choosing a background overlay.
 */
export default function BackgroundSelector({
  selectedBackground,
  onSelect,
}: BackgroundSelectorProps) {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.label}>🎨 Background</h3>
      <div className={styles.optionList}>
        {backgrounds.map(bg => {
          const isSelected = selectedBackground.id === bg.id;
          return (
            <button
              key={bg.id}
              className={styles.optionButton}
              onClick={() => onSelect(bg)}
              title={bg.name}
              aria-pressed={isSelected}
              style={
                isSelected
                  ? {
                      border: '2px solid #fff',
                      background: 'rgba(255,255,255,0.2)',
                      color: '#fff',
                      boxShadow: '0 0 12px rgba(255,255,255,0.3)',
                    }
                  : undefined
              }
            >
              <span aria-hidden="true">{bg.emoji}</span>
              <span>{bg.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
