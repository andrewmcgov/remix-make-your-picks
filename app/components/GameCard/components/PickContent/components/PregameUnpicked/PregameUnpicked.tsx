import {IndexGame} from '~/utilities/types';
import {GameTime} from '../GameTime';
import {PickForm} from '../PickForm';

export interface PreGameUnpickedProps {
  game: IndexGame;
}

export function PregameUnpicked({game}: PreGameUnpickedProps) {
  return (
    <div className="vertically-spaced">
      <GameTime start={game.start} />
      <PickForm game={game} />
    </div>
  );
}
