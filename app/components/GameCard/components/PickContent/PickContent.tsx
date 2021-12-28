import {IndexGame, SafeUser} from '~/utilities/types';
import {MidgamePicked} from './components/MidgamePicked';
import {PostGamePicked} from './components/PostGamePicked';
import {PoststartUnpicked} from './components/PoststartUnpicked';
import {PregamePicked} from './components/PregamePicked';
import {PregameUnpicked} from './components/PregameUnpicked';

export interface PickContentProps {
  game: IndexGame;
  user: SafeUser;
  gameStarted: boolean;
  gameClosed: boolean;
}

export function PickContent({
  game,
  user,
  gameStarted,
  gameClosed,
}: PickContentProps) {
  if (game.userPick && !gameStarted) {
    return <PregamePicked game={game} userPick={game.userPick} />;
  } else if (game.userPick && gameStarted && !gameClosed) {
    // Show user pick with 'locked in' icon
    return <MidgamePicked game={game} userPick={game.userPick} />;
  } else if (!game.userPick && !gameStarted) {
    // Show GameForm for user to make pick
    return <PregameUnpicked game={game} />;
  } else if (game.userPick && gameClosed) {
    return <PostGamePicked game={game} userPick={game.userPick} />;
  }

  return <PoststartUnpicked game={game} />;
}
