import {useState, useEffect} from 'react';
import ConfettiLib from 'react-confetti';

export interface ConfettiProps {
  homeWins: boolean;
}

export function Confetti({homeWins}: ConfettiProps) {
  const [height, setHeight] = useState<number>();
  const [width, setWidth] = useState<number>();
  const chiefsColors = ['#E31837', '#FFB81C', '#FFFFFF'];
  const eaglesColors = ['#004C54', '#A5ACAF', '#FFFFFF'];
  const colors = homeWins ? eaglesColors : chiefsColors;

  useEffect(() => {
    setHeight(window.innerHeight);
    setWidth(window.innerWidth);
  }, []);

  return width ? (
    <ConfettiLib
      height={height}
      width={width}
      colors={colors}
      numberOfPieces={300}
    />
  ) : null;
}
