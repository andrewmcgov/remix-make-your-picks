import {
  LoaderFunction,
  useLoaderData,
  redirect,
  MetaFunction,
  Link,
} from 'remix';
import {SafeUser, AdminGame} from '~/utilities/types';
import {currentUser} from '~/utilities/user.server';
import {db} from '~/utilities/db.server';
import {Layout} from '~/components/Layout';
import {defaultWeek, defaultSeason} from '../utilities/static-data';
import {GameFilter} from '~/components/GameFilter';
import {getNewMatchesForLinks} from '@remix-run/react/links';

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

  // TODO: Restrict to only certain users
  if (!user) {
    return redirect('/login');
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
      <h1>Admin</h1>
      <GameFilter />
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
                    <Link to={gamePath}>{game.away.city}</Link>
                  </td>
                  <td>
                    <Link to={gamePath}>{game.home.city}</Link>
                  </td>
                  <td>
                    <Link to={gamePath}>{game.start}</Link>
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
    </Layout>
  );
}
