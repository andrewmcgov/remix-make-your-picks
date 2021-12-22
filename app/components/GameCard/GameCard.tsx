import {hasGameStarted} from '~/utilities/games';
import {IndexGame, SafeUser} from '~/utilities/types';
import {NoUserPick} from './components/NoUserPick';
import {PickContent} from './components/PickContent';

export interface GameCardProps {
  game: IndexGame;
  user: SafeUser | null;
}

export function GameCard({game, user}: GameCardProps) {
  const gameStarted = hasGameStarted(game);

  const pickMarkup = user ? (
    <PickContent game={game} user={user} gameStarted={gameStarted} />
  ) : (
    <NoUserPick gameStarted={gameStarted} />
  );

  return (
    <div className="GameCard card card--full">
      <div className="GameCard__matchup">
        <p className={`GameCard__team NFL-${game.away.abr}`}>{game.away.abr}</p>
        <p className={`GameCard__team NFL-${game.home.abr}`}>{game.home.abr}</p>
      </div>
      <div className="GameCard__pick">{pickMarkup}</div>
    </div>
  );
}
