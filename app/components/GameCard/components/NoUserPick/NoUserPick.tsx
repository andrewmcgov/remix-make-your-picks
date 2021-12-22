export interface NoUserPickProps {
  gameStarted: boolean;
}

export function NoUserPick({gameStarted}: NoUserPickProps) {
  return (
    <p className="text-center">
      {gameStarted
        ? 'The game has started.'
        : 'Please login to make your pick.'}
    </p>
  );
}
