import {IndexGame} from '~/utilities/types';

export interface GameCardProps {
  game: IndexGame;
}

export function GameCard({game}: GameCardProps) {
  return (
    <div className="GameCard card card--full">
      <div className="GameCard__matchup">
        <p className={`GameCard__team NFL-${game.away.abr}`}>{game.away.abr}</p>
        <p className={`GameCard__team NFL-${game.home.abr}`}>{game.home.abr}</p>
      </div>
      <div className="GameCard__pick">
        <h3 className="text-center">Pick games here</h3>
        <h3 className="text-center">🔜</h3>
      </div>
    </div>
  );
}
