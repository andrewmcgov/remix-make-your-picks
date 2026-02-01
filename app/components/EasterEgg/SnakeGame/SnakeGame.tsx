import {useEffect, useState, useCallback} from 'react';
import {FiX} from 'react-icons/fi';
import {useSnakeGame} from './hooks/useSnakeGame';
import {useHighScore} from './hooks/useHighScore';
import {GameBoard} from './components/GameBoard';
import {GameControls} from './components/GameControls';
import {GameOverlay} from './components/GameOverlay';
import type {Direction} from './hooks/useSnakeGame';

interface SnakeGameProps {
  onClose: () => void;
}

export function SnakeGame({onClose}: SnakeGameProps) {
  const [countdown, setCountdown] = useState<number | null>(3);
  const [isGameStarted, setIsGameStarted] = useState(false);
  
  const {
    snake,
    food,
    direction,
    score,
    isGameOver,
    isPaused,
    changeDirection,
    resetGame,
    togglePause,
    gridSize,
  } = useSnakeGame(true); // Start paused
  
  const {highScore, updateHighScore} = useHighScore();
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);

  // Countdown timer before game starts
  useEffect(() => {
    if (countdown === null) {
      return;
    }
    
    if (countdown === 0) {
      setIsGameStarted(true);
      // Unpause the game when countdown finishes
      setTimeout(() => {
        if (isPaused) {
          togglePause();
        }
      }, 0);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, isPaused, togglePause]);

  // Detect if mobile controls should be shown
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;
      setShowMobileControls(isTouchDevice || isSmallScreen);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle keyboard controls (only when game is started)
  useEffect(() => {
    if (!isGameStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling behavior for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
          changeDirection('UP');
          break;
        case 'ArrowDown':
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
          changeDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, isGameStarted]);

  // Update high score when game ends
  useEffect(() => {
    if (isGameOver && score > 0) {
      const isNew = updateHighScore(score);
      setIsNewHighScore(isNew);
    }
  }, [isGameOver, score, updateHighScore]);

  const handleRestart = useCallback(() => {
    setIsNewHighScore(false);
    setCountdown(3);
    setIsGameStarted(false);
    resetGame();
    // Pause will be set in the useEffect
  }, [resetGame]);

  const handleClose = useCallback(() => {
    setIsNewHighScore(false);
    resetGame();
    onClose();
  }, [resetGame, onClose]);

  return (
    <div className="SnakeGame">
      <div className="SnakeGame__container">
        {/* Header with scores and close button */}
        <div className="SnakeGame__header">
          <div className="GameOverlay__scores">
            <div className="GameOverlay__score">
              <span className="GameOverlay__label">Score:</span>
              <span className="GameOverlay__value">{score}</span>
            </div>
            <div className="GameOverlay__highscore">
              <span className="GameOverlay__label">High Score:</span>
              <span className="GameOverlay__value">{highScore}</span>
            </div>
          </div>
          <button
            className="GameOverlay__close"
            onClick={handleClose}
            aria-label="Close game"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Game board */}
        <div className="SnakeGame__board-wrapper">
          <GameBoard snake={snake} food={food} gridSize={gridSize} />
          
          {/* Overlays (countdown and game over) */}
          <GameOverlay
            score={score}
            isGameOver={isGameOver}
            onRestart={handleRestart}
            onClose={handleClose}
            isNewHighScore={isNewHighScore}
            countdown={countdown}
            isGameStarted={isGameStarted}
          />
        </div>

        {/* Mobile controls */}
        {showMobileControls && isGameStarted && (
          <GameControls onDirectionChange={changeDirection} />
        )}
      </div>
    </div>
  );
}
