import {useState} from 'react';
import {IndexGame, SafeUser} from '~/utilities/types';
import {PickForm} from './components/PickForm';

export interface PickContentProps {
  game: IndexGame;
  user: SafeUser;
  gameStarted: boolean;
}

export function PickContent({game, user, gameStarted}: PickContentProps) {
  const [showForm, setShowForm] = useState(false);
  if (game.userPick && !gameStarted) {
    // Show current pick and option to change pick with PickForm
    return showForm ? (
      <PickForm game={game} />
    ) : (
      <p className="text-center">
        You picked the {game.userPick.team.nickName}, but there is still time to{' '}
        <button onClick={() => setShowForm(true)}>change your pick.</button>.
      </p>
    );
  } else if (game.userPick && gameStarted) {
    // Show user pick with 'locked in' icon
    return (
      <p className="text-center">
        Picks are locked in. You picked the {game.userPick.team.nickName}.
      </p>
    );
  } else if (!game.userPick && !gameStarted) {
    // Show GameForm for user to make pick
    return <PickForm game={game} />;
  }

  return <p className="text-center">Picks for this game are locked in.</p>;
}
