import {hasGameStarted, isGameClosed} from '~/utilities/games';
import {IndexGame, SafeUser} from '~/utilities/types';
import {NoUserPick} from './components/NoUserPick';
import {PickContent} from './components/PickContent';

export interface GameCardProps {
  game: IndexGame;
  user: SafeUser | null;
}

export function GameCard({game, user}: GameCardProps) {
  const gameStarted = hasGameStarted(game);
  const gameClosed = isGameClosed(game);

  console.log({gameStarted, gameClosed});
  const pickMarkup = user ? (
    <PickContent
      game={game}
      user={user}
      gameStarted={gameStarted}
      gameClosed={gameClosed}
    />
  ) : (
    <NoUserPick game={game} gameStarted={gameStarted} />
  );

  return (
    <div className="GameCard card card--full">
      <div className="GameCard__matchup">
        <div className={`GameCard__team NFL-${game.away.abr}`}>
          <p>{game.away.abr}</p>
          {game.awayScore !== null && <p>{game.awayScore}</p>}
        </div>
        <div className={`GameCard__team NFL-${game.home.abr}`}>
          <p>{game.home.abr}</p>
          {game.homeScore !== null && <p>{game.homeScore}</p>}
        </div>
      </div>
      <div className="GameCard__pick">{pickMarkup}</div>
    </div>
  );
}
