import {IndexGame} from '~/utilities/types';

export interface PicksListProps {
  game: IndexGame;
}

export function PicksList({game}: PicksListProps) {
  const awayPicks = [...game.awayPickUsernames, 'Kevin', 'Erin', 'Andrew'];
  const homePicks = [
    ...game.homePickUsernames,
    'Scott',
    'Ryan',
    'Alex',
    'Thomas',
    'Connor',
  ];

  return <div>PicksList</div>;
}
