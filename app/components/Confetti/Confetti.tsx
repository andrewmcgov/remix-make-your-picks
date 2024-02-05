import {useState, useEffect} from 'react';
import ConfettiLib from 'react-confetti';

export interface ConfettiProps {
  homeWins: boolean;
}

export function Confetti({homeWins}: ConfettiProps) {
  const [height, setHeight] = useState<number>();
  const [width, setWidth] = useState<number>();
  const [confettiStopped, setConfettiStopped] = useState(false);
  const sanFranColors = ['#AA0000', '#B3995D', '#FFFFFF'];
  const chiefsColors = ['#E31837', '#FFB81C', '#FFFFFF'];
  const colors = homeWins ? chiefsColors : sanFranColors;

  useEffect(() => {
    setHeight(window.innerHeight);
    setWidth(window.innerWidth);
  }, []);

  return width ? (
    <>
      {confettiStopped ? null : (
        <ConfettiLib
          height={height}
          width={width}
          colors={colors}
          numberOfPieces={300}
        />
      )}
      <div className="ConfettiToggle">
        <button
          className="secondary"
          onClick={() => setConfettiStopped(!confettiStopped)}
        >
          {confettiStopped ? 'Start confetti' : 'Stop confetti'}
        </button>
      </div>
    </>
  ) : null;
}
