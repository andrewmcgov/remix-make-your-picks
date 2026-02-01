import {useState, useEffect} from 'react';

const HIGH_SCORE_KEY = 'makeyourpicks_snake_highscore';

export function useHighScore() {
  const [highScore, setHighScore] = useState<number>(0);

  useEffect(() => {
    // Read high score from localStorage on mount
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(HIGH_SCORE_KEY);
        if (stored) {
          const parsed = parseInt(stored, 10);
          if (!isNaN(parsed)) {
            setHighScore(parsed);
          }
        }
      } catch (error) {
        console.error('Failed to read high score from localStorage:', error);
      }
    }
  }, []);

  const updateHighScore = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(HIGH_SCORE_KEY, score.toString());
        } catch (error) {
          console.error('Failed to save high score to localStorage:', error);
        }
      }
      return true; // Indicates new high score
    }
    return false;
  };

  return {highScore, updateHighScore};
}
