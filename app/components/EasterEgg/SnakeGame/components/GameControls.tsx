import type {Direction} from '../hooks/useSnakeGame';

interface GameControlsProps {
  onDirectionChange: (direction: Direction) => void;
}

export function GameControls({onDirectionChange}: GameControlsProps) {
  const handleClick = (direction: Direction) => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDirectionChange(direction);
  };

  return (
    <div className="GameControls">
      <div className="GameControls__row">
        <button
          className="GameControls__button"
          onPointerDown={handleClick('UP')}
          aria-label="Move up"
        >
          ↑
        </button>
      </div>
      <div className="GameControls__row">
        <button
          className="GameControls__button"
          onPointerDown={handleClick('LEFT')}
          aria-label="Move left"
        >
          ←
        </button>
        <button
          className="GameControls__button"
          onPointerDown={handleClick('DOWN')}
          aria-label="Move down"
        >
          ↓
        </button>
        <button
          className="GameControls__button"
          onPointerDown={handleClick('RIGHT')}
          aria-label="Move right"
        >
          →
        </button>
      </div>
    </div>
  );
}
