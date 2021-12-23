import {
  LoaderFunction,
  useLoaderData,
  redirect,
  MetaFunction,
  ActionFunction,
} from 'remix';
import {SafeUser, AdminGame, Option} from '~/utilities/types';
import {currentUser} from '~/utilities/user.server';
import {db} from '~/utilities/db.server';
import {Layout} from '~/components/Layout';
import {GameForm} from '~/components/GameForm';
import {getTeamOptions} from '~/utilities/teams.server';
import {isAdmin} from '~/utilities/user';
import {getGameData} from '~/utilities/games.server';

interface LoaderResponse {
  user: SafeUser;
  game: AdminGame;
  teamOptions: Option[];
}
interface Errors {
  [key: string]: string;
}

export const meta: MetaFunction = () => {
  return {
    title: 'Admin | Make your picks',
    description: 'NFL playoff picks',
  };
};

export let loader: LoaderFunction = async ({request, params}) => {
  const user = await currentUser(request);

  if (!user || !isAdmin(user)) {
    return redirect('/');
  }

  const teamOptions = await getTeamOptions();
  const game = await db.game.findUnique({
    where: {
      id: Number(params.gameId),
    },
    include: {
      home: true,
      away: true,
      picks: {select: {id: true}},
    },
  });

  if (!game) {
    throw new Response('Not Found', {status: 404});
  }

  return {user, game, teamOptions};
};

export const action: ActionFunction = async ({request, params}) => {
  let errors: Errors = {};
  const user = await currentUser(request);

  if (!user || !isAdmin(user)) {
    errors.message = 'Only admins can edit games.';
    return {errors};
  }

  const {homeId, awayId, date, time, week} = await getGameData(request);

  if (!homeId || !awayId || !date || !time || !week) {
    errors.message = 'You must provide all values.';
    return {errors};
  }

  const start = new Date(`${date} ${time}`);

  const game = await db.game.update({
    where: {id: Number(params.gameId)},
    data: {
      home: {connect: {id: Number(homeId)}},
      away: {connect: {id: Number(awayId)}},
      start,
      league: 'NFL',
      week: week,
      season: '2021',
    },
  });

  if (!game) {
    errors.message = 'There was an error creating this game.';
    return {errors};
  }

  return redirect('/admin');
};

export default function AdminGame() {
  const {user, game, teamOptions} = useLoaderData<LoaderResponse>();

  return (
    <Layout user={user}>
      <h1>
        {game.away.nickName} @ {game.home.nickName}
      </h1>
      <GameForm teamOptions={teamOptions} game={game} />
    </Layout>
  );
}
