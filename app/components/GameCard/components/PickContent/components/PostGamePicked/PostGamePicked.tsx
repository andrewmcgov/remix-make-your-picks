import {FiTrendingDown, FiTrendingUp} from 'react-icons/fi';
import {IndexGame, PickWithTeamAndUsername} from '~/utilities/types';
import {GameTime} from '../GameTime';

export interface MidgamePickedProps {
  game: IndexGame;
  userPick: PickWithTeamAndUsername;
}

export function PostGamePicked({game, userPick}: MidgamePickedProps) {
  const text = userPick.correct ? (
    <p className="text-center">
      🎉 Nice one! You picked the <strong>{userPick.team.nickName}</strong>.
    </p>
  ) : (
    <p className="text-center">
      👎 Ouch. You picked the <strong>{userPick.team.nickName}</strong>.
    </p>
  );

  const icon = userPick.correct ? <FiTrendingUp /> : <FiTrendingDown />;

  return (
    <div className="vertically-spaced">
      <GameTime start={game.start} />
      {icon}
      {text}
    </div>
  );
}
