import {
  LoaderFunction,
  useLoaderData,
  redirect,
  MetaFunction,
  Link,
} from 'remix';
import {SafeUser, AdminGame} from '~/utilities/types';
import {currentUser} from '~/utilities/user.server';
import {isAdmin} from '~/utilities/user';
import {db} from '~/utilities/db.server';
import {Layout} from '~/components/Layout';
import {defaultWeek, defaultSeason} from '../utilities/static-data';
import {GameFilter} from '~/components/GameFilter';
import {format} from 'date-fns';

interface LoaderResponse {
  user: SafeUser;
  games: AdminGame[];
}

export const meta: MetaFunction = () => {
  return {
    title: 'Admin | Make your picks',
    description: 'NFL playoff picks',
  };
};

export let loader: LoaderFunction = async ({request}) => {
  const user = await currentUser(request);

  if (!user || !isAdmin(user)) {
    return redirect('/');
  }

  let url = new URL(request.url);
  const week = url.searchParams.get('week') || defaultWeek;
  const season = url.searchParams.get('season') || defaultSeason;

  let games = await db.game.findMany({
    where: {
      week,
      season,
    },
    include: {
      home: true,
      away: true,
      picks: {select: {id: true}},
    },
  });

  return {user, games};
};

export default function Admin() {
  const {user, games} = useLoaderData<LoaderResponse>();

  return (
    <Layout user={user}>
      <div className="AdminHeading">
        <h1>Admin</h1>
        <Link to="/admin/games/new" className="button">
          New game
        </Link>
      </div>
      <GameFilter />
      {games.length > 1 ? (
        <div className="card">
          <table>
            <tbody>
              <tr>
                <th>Away</th>
                <th>Home</th>
                <th>Time</th>
                <th>Picks</th>
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
      )}
    </Layout>
  );
}
