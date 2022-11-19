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
import {GameFilter} from '~/components/GameFilter';
import {AdminGamesTable} from '~/components/AdminGamesTable';
import {gameFilters} from '~/utilities/games.server';

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

  const {week, season} = gameFilters(request);
  const users = await db.user.findMany({select: {id: true, username: true}});
  const games = await db.game.findMany({
    where: {
      week,
      season,
    },
    include: {
      home: true,
      away: true,
      picks: {select: {id: true, userId: true}},
    },
  });

  const gamesWithStillToPickUsers = games.map((game) => {
    return {
      ...game,
      stillToPick: users
        .filter(
          (user) =>
            !game.picks.some((pick) => pick.userId === user.id) &&
            !(process.env.NODE_ENV !== 'development' && user.id === 1)
        )
        .map((user) => user.username)
        .join(', '),
    };
  });

  return {user, games: gamesWithStillToPickUsers};
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
      <AdminGamesTable games={games} />
      <Link to="/admin/leaderboard" className="button">
        Update leaderboard
      </Link>
    </Layout>
  );
}
