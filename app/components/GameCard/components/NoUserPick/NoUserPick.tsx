import {IndexGame} from '~/utilities/types';
import {GameTime} from '../PickContent/components/GameTime';

export interface NoUserPickProps {
  gameStarted: boolean;
  game: IndexGame;
}

export function NoUserPick({gameStarted, game}: NoUserPickProps) {
  return (
    <div className="vertically-spaced">
      <GameTime start={game.start} />
      <p className="text-center">
        {gameStarted
          ? 'The game has started.'
          : 'Please login to make your pick.'}
      </p>
    </div>
  );
}
