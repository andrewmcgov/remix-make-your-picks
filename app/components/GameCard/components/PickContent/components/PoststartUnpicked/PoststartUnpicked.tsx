import {FiLock} from 'react-icons/fi';
import {IndexGame} from '~/utilities/types';
import {GameTime} from '../GameTime';

export interface PoststartUnpickedProps {
  game: IndexGame;
}

export function PoststartUnpicked({game}: PoststartUnpickedProps) {
  return (
    <div className="vertically-spaced">
      <GameTime start={game.start} />
      <FiLock />
      <p className="text-center">
        Picks are locked in. You missed your chance!
      </p>
    </div>
  );
}
