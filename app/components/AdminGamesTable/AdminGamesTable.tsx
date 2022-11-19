import {format} from 'date-fns';
import {Link} from 'remix';
import {AdminGame} from '~/utilities/types';

export interface AdminGamesTableProps {
  games: AdminGame[];
}

export function AdminGamesTable({games}: AdminGamesTableProps) {
  return games.length > 0 ? (
    <div className="card scroll">
      <table>
        <tbody>
          <tr>
            <th>Away</th>
            <th>Home</th>
            <th>Time</th>
            <th>Picks</th>
            <th>Not yet picked</th>
          </tr>
          {games.map((game) => {
            const gamePath = `/admin/games/${game.id}`;
            return (
              <tr key={game.id}>
                <td>
                  <Link to={gamePath}>
                    {game.away.city}
                    {game.awayScore !== null && ` - ${game.awayScore}`}
                  </Link>
                </td>
                <td>
                  <Link to={gamePath}>
                    {game.home.city}
                    {game.homeScore !== null && ` - ${game.homeScore}`}
                  </Link>
                </td>
                <td>
                  <Link to={gamePath}>
                    {format(new Date(game.start), 'E LLL do, y h:mm bbb')}
                  </Link>
                </td>
                <td>
                  <Link to={gamePath}>{game.picks.length}</Link>
                </td>
                <td>
                  <Link to={gamePath}>{game.stillToPick}</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="card">
      <p className="empty-state">
        No games found for this week. Try changing the filters above.
      </p>
    </div>
  );
}
