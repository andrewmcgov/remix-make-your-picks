import {IndexGame, SafeUser} from '~/utilities/types';
import {MidgamePicked} from './components/MidgamePicked';
import {PoststartUnpicked} from './components/PoststartUnpicked';
import {PregamePicked} from './components/PregamePicked';
import {PregameUnpicked} from './components/PregameUnpicked';

export interface PickContentProps {
  game: IndexGame;
  user: SafeUser;
  gameStarted: boolean;
}

export function PickContent({game, user, gameStarted}: PickContentProps) {
  if (game.userPick && !gameStarted) {
    return <PregamePicked game={game} userPick={game.userPick} />;
  } else if (game.userPick && gameStarted) {
    // Show user pick with 'locked in' icon
    return <MidgamePicked game={game} userPick={game.userPick} />;
  } else if (!game.userPick && !gameStarted) {
    // Show GameForm for user to make pick
    return <PregameUnpicked game={game} />;
  }

  return <PoststartUnpicked game={game} />;
}
