import {FiX} from 'react-icons/fi';

interface GameOverlayProps {
  score: number;
  isGameOver: boolean;
  onRestart: () => void;
  onClose: () => void;
  isNewHighScore?: boolean;
  countdown: number | null;
  isGameStarted: boolean;
}

export function GameOverlay({
  score,
  isGameOver,
  onRestart,
  onClose,
  isNewHighScore,
  countdown,
  isGameStarted,
}: GameOverlayProps) {
  return (
    <>
      {/* Countdown overlay */}
      {!isGameStarted && countdown !== null && countdown > 0 && (
        <div className="GameOverlay__countdown">
          <div className="GameOverlay__countdown-content">
            <div className="GameOverlay__countdown-number">{countdown}</div>
            <p className="GameOverlay__countdown-text">Get Ready!</p>
          </div>
        </div>
      )}

      {/* Game over overlay */}
      {isGameOver && (
        <div className="GameOverlay__gameover">
          <div className="GameOverlay__gameover-content">
            <h2 className="GameOverlay__title">Game Over!</h2>
            <p className="GameOverlay__final-score">Final Score: {score}</p>
            {isNewHighScore && (
              <p className="GameOverlay__new-high">🎉 New High Score! 🎉</p>
            )}
            <div className="GameOverlay__buttons">
              <button
                className="GameOverlay__button GameOverlay__button--primary"
                onClick={onRestart}
              >
                Play Again
              </button>
              <button
                className="GameOverlay__button GameOverlay__button--secondary"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
