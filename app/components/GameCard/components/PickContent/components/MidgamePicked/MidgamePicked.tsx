import {FiLock} from 'react-icons/fi';
import {IndexGame, PickWithTeamAndUsername} from '~/utilities/types';
import {GameTime} from '../GameTime';

export interface MidgamePickedProps {
  game: IndexGame;
  userPick: PickWithTeamAndUsername;
}

export function MidgamePicked({game, userPick}: MidgamePickedProps) {
  return (
    <div className="vertically-spaced">
      <GameTime start={game.start} />
      <FiLock />
      <p className="text-center">
        Picks are locked in. You picked the{' '}
        <strong>{userPick.team.nickName}</strong>.
      </p>
    </div>
  );
}
