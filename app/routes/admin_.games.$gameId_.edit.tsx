import {useLoaderData, Link} from '@remix-run/react';
import {
  redirect,
  LoaderFunction,
  V2_MetaFunction as MetaFunction,
  ActionFunction,
} from '@remix-run/node';
import {
  SafeUser,
  AdminGame as AdminGameType,
  Option,
  Errors,
} from '~/utilities/types';
import {currentUser} from '~/utilities/user.server';
import {db} from '~/utilities/db.server';
import {Layout} from '~/components/Layout';
import {GameForm} from '~/components/GameForm';
import {getTeamOptions} from '~/utilities/teams.server';
import {isAdmin} from '~/utilities/user';
import {getGameData} from '~/utilities/games.server';
import {defaultSeason, defaultWeek} from '~/utilities/static-data';

interface LoaderResponse {
  user: SafeUser;
  game: AdminGameType;
  teamOptions: Option[];
}

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Admin game | Make your picks',
    },
    {name: 'description', content: 'NFL playoff picks'},
  ];
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

  const {homeId, awayId, startString, week, season} = await getGameData(
    request
  );

  if (!homeId || !awayId || !startString || !week) {
    errors.message = 'You must provide all values.';
    return {errors};
  }

  const start = new Date(startString);

  const game = await db.game.update({
    where: {id: Number(params.gameId)},
    data: {
      home: {connect: {id: Number(homeId)}},
      away: {connect: {id: Number(awayId)}},
      start,
      league: 'NFL',
      week: week,
      season: season || defaultSeason,
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
      <div className="AdminHeading">
        <h1>
          {game.away.nickName} @ {game.home.nickName}
        </h1>
        <Link to={`/admin/games/${game.id}`} className="button">
          Close game
        </Link>
      </div>
      <GameForm teamOptions={teamOptions} game={game} />
    </Layout>
  );
}
