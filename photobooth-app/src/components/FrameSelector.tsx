import type { Frame } from '../types';
import { frames } from '../data/frames';
import styles from './SelectorGroup.module.css';

interface FrameSelectorProps {
  selectedFrame: Frame;
  onSelect: (frame: Frame) => void;
}

/**
 * Renders a pill-button list for choosing a photo strip frame.
 */
export default function FrameSelector({ selectedFrame, onSelect }: FrameSelectorProps) {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.label}>🖼️ Frame</h3>
      <div className={styles.optionList}>
        {frames.map(frame => {
          const isSelected = selectedFrame.id === frame.id;
          return (
            <button
              key={frame.id}
              className={styles.optionButton}
              onClick={() => onSelect(frame)}
              title={frame.name}
              aria-pressed={isSelected}
              style={
                isSelected
                  ? {
                      border: `2px solid ${frame.borderColor}`,
                      background: frame.bgColor,
                      color: frame.textColor,
                      boxShadow: `0 0 12px ${frame.borderColor}66`,
                    }
                  : undefined
              }
            >
              <span aria-hidden="true">{frame.emoji}</span>
              <span>{frame.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
