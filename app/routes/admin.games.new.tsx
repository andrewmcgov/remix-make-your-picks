import {
  LoaderFunction,
  useLoaderData,
  redirect,
  MetaFunction,
  ActionFunction,
} from 'remix';
import {SafeUser, Option} from '~/utilities/types';
import {currentUser} from '~/utilities/user.server';
import {isAdmin} from '~/utilities/user';
import {db} from '~/utilities/db.server';
import {Layout} from '~/components/Layout';

import {GameForm} from '~/components/GameForm';
import {getTeamOptions} from '~/utilities/teams.server';
import {getGameData} from '~/utilities/games.server';

interface LoaderResponse {
  user: SafeUser;
  teamOptions: Option[];
}

interface Errors {
  [key: string]: string;
}

export const meta: MetaFunction = () => {
  return {
    title: 'New game | Make your picks',
    description: 'NFL playoff picks',
  };
};

export const loader: LoaderFunction = async ({request}) => {
  const user = await currentUser(request);

  if (!user || !isAdmin(user)) {
    return redirect('/');
  }

  const teamOptions = await getTeamOptions();

  return {user, teamOptions};
};

export const action: ActionFunction = async ({request}) => {
  let errors: Errors = {};
  const user = await currentUser(request);

  if (!user || !isAdmin(user)) {
    errors.message = 'Only admins can create games.';
    return {errors};
  }

  const {homeId, awayId, date, time, week} = await getGameData(request);

  if (!homeId || !awayId || !date || !time || !week) {
    errors.message = 'You must provide all values.';
    return {errors};
  }

  const start = new Date(`${date} ${time}`);

  const game = await db.game.create({
    data: {
      home: {connect: {id: Number(homeId)}},
      away: {connect: {id: Number(awayId)}},
      start,
      league: 'NFL',
      week,
      season: '2021',
    },
  });

  if (!game) {
    errors.message = 'There was an error creating this game.';
    return {errors};
  }

  return redirect('/admin');
};

export default function CreateGame() {
  const {user, teamOptions} = useLoaderData<LoaderResponse>();

  return (
    <Layout user={user}>
      <div className="">
        <h1>New game</h1>
      </div>
      <GameForm teamOptions={teamOptions} />
    </Layout>
  );
}
