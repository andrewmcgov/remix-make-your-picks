import {useState} from 'react';
import {FiCheckCircle} from 'react-icons/fi';
import {IndexGame, PickWithTeamAndUsername} from '~/utilities/types';
import {GameTime} from '../GameTime';
import {PickForm} from '../PickForm';

export interface PregamePickedProps {
  game: IndexGame;
  userPick: PickWithTeamAndUsername;
}

export function PregamePicked({game, userPick}: PregamePickedProps) {
  const [showForm, setShowForm] = useState(false);

  // Show current pick and option to change pick with PickForm
  return showForm ? (
    <div className="vertically-spaced">
      <GameTime start={game.start} />
      <p className="text-center">
        Current pick: <strong>{userPick.team.nickName}</strong>
      </p>
      <PickForm game={game} onSubmit={() => setShowForm(false)} />
    </div>
  ) : (
    <div className="vertically-spaced">
      <GameTime start={game.start} />
      <p className="text-center">
        You picked the <strong>{userPick.team.nickName}</strong>, want to{' '}
        <button className="plain" onClick={() => setShowForm(true)}>
          change your pick
        </button>
        ?
      </p>
      <FiCheckCircle />
    </div>
  );
}
