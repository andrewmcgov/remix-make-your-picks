import type {Direction} from '../hooks/useSnakeGame';

interface GameControlsProps {
  onDirectionChange: (direction: Direction) => void;
}

export function GameControls({onDirectionChange}: GameControlsProps) {
  return (
    <div className="GameControls">
      <div className="GameControls__row">
        <button
          className="GameControls__button"
          onTouchStart={(e) => {
            e.preventDefault();
            onDirectionChange('UP');
          }}
          onClick={() => onDirectionChange('UP')}
          aria-label="Move up"
        >
          ↑
        </button>
      </div>
      <div className="GameControls__row">
        <button
          className="GameControls__button"
          onTouchStart={(e) => {
            e.preventDefault();
            onDirectionChange('LEFT');
          }}
          onClick={() => onDirectionChange('LEFT')}
          aria-label="Move left"
        >
          ←
        </button>
        <button
          className="GameControls__button"
          onTouchStart={(e) => {
            e.preventDefault();
            onDirectionChange('DOWN');
          }}
          onClick={() => onDirectionChange('DOWN')}
          aria-label="Move down"
        >
          ↓
        </button>
        <button
          className="GameControls__button"
          onTouchStart={(e) => {
            e.preventDefault();
            onDirectionChange('RIGHT');
          }}
          onClick={() => onDirectionChange('RIGHT')}
          aria-label="Move right"
        >
          →
        </button>
      </div>
    </div>
  );
}
