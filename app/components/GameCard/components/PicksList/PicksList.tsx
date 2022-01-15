import {IndexGame} from '~/utilities/types';

export interface PicksListProps {
  game: IndexGame;
}

export function PicksList({game}: PicksListProps) {
  const awayPicks = game.awayPickUsernames;
  const homePicks = game.homePickUsernames;

  return (
    <div className="PicksList">
      <ul className="home-picks">
        {awayPicks.map((pick, i) => (
          <li key={pick}>{pick + (i === awayPicks.length - 1 ? '' : ',')}</li>
        ))}
      </ul>
      <ul className="away-picks">
        {homePicks.map((pick, i) => (
          <li key={pick}>{pick + (i === homePicks.length - 1 ? '' : ',')}</li>
        ))}
      </ul>
    </div>
  );
}
