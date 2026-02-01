import {useState, useEffect} from 'react';

interface EyesEmojiProps {
  onTrigger: () => void;
}

type AnimationPhase = 'initial' | 'sliding-in' | 'visible' | 'sliding-out' | 'hidden';

export function EyesEmoji({onTrigger}: EyesEmojiProps) {
  const [phase, setPhase] = useState<AnimationPhase>('initial');
  const [side, setSide] = useState<'left' | 'right'>('left');
  const [verticalPosition, setVerticalPosition] = useState(50);

  useEffect(() => {
    // Randomize side and vertical position
    setSide(Math.random() > 0.5 ? 'right' : 'left');
    setVerticalPosition(Math.random() * 60 + 20); // 20% to 80%

    // Start animation after a brief delay to allow initial render
    const startTimer = setTimeout(() => {
      setPhase('sliding-in');
    }, 100);
    
    const visibleTimer = setTimeout(() => {
      setPhase('visible');
    }, 2100);

    const slideOutTimer = setTimeout(() => {
      setPhase('sliding-out');
    }, 5100);

    const hideTimer = setTimeout(() => {
      setPhase('hidden');
    }, 7100);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(visibleTimer);
      clearTimeout(slideOutTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleClick = () => {
    setPhase('hidden');
    onTrigger();
  };

  if (phase === 'hidden') {
    return null;
  }

  return (
    <div
      className={`EyesEmoji EyesEmoji--${side} ${phase !== 'initial' ? `EyesEmoji--${phase}` : ''}`}
      style={{top: `${verticalPosition}%`}}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      aria-label="Easter egg - click to play snake game"
    >
      👀
    </div>
  );
}
