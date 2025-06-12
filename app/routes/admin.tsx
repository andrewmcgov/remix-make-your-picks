import { LoaderFunction, redirect, MetaFunction } from 'react-router';
import { useLoaderData, Link } from 'react-router';
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
  totalTieBreakers: number;
  usersWithoutTiebreaker: string;
}

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Admin | Make your picks',
    },
    {name: 'description', content: 'NFL playoff picks'},
  ];
};

export const loader: LoaderFunction = async ({request}) => {
  const user = await currentUser(request);

  if (!user || !isAdmin(user)) {
    return redirect('/');
  }

  const {week, season} = gameFilters(request);
  const users = await db.user.findMany({select: {id: true, username: true}});
  const tieBreakers =
    week === 'SB' ? await db.tieBreaker.findMany({where: {season}}) : undefined;
  const usersWithoutTiebreaker = users
    .filter(
      (user) =>
        !tieBreakers?.some((tieBreaker) => tieBreaker.userId === user.id)
    )
    .map((user) => user.username)
    .join(', ');
  const totalTieBreakers = tieBreakers?.length || 0;

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
    orderBy: {
      start: 'asc',
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

  return {
    user,
    games: gamesWithStillToPickUsers,
    totalTieBreakers,
    usersWithoutTiebreaker,
  };
};

export default function Admin() {
  const {user, games, totalTieBreakers, usersWithoutTiebreaker} =
    useLoaderData<LoaderResponse>();

  return (
    <Layout user={user}>
      <div className="AdminHeading">
        <h1>Admin</h1>
        <Link to="/admin/games/new" className="button">
          New game
        </Link>
      </div>
      <GameFilter />
      {games[0]?.week === 'SB' ? (
        <div className="card">
          <p>Total tiebreakers picked: {totalTieBreakers}</p>
          <p>Still to pick: {usersWithoutTiebreaker || 'None!'}</p>
        </div>
      ) : null}
      <AdminGamesTable games={games} />
      <Link to="/admin/leaderboard" className="button">
        Update leaderboard
      </Link>
    </Layout>
  );
}
