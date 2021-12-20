import {LoaderFunction, useLoaderData, redirect, MetaFunction} from 'remix';
import {SafeUser, AdminGame} from '~/utilities/types';
import {currentUser} from '~/utilities/user.server';
import {db} from '~/utilities/db.server';
import {Layout} from '~/components/Layout';

interface LoaderResponse {
  user: SafeUser;
  game: AdminGame;
}

export const meta: MetaFunction = () => {
  return {
    title: 'Admin | Make your picks',
    description: 'NFL playoff picks',
  };
};

export let loader: LoaderFunction = async ({request, params}) => {
  const user = await currentUser(request);

  // TODO: Restrict to only certain users
  if (!user) {
    return redirect('/login');
  }

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

  return {user, game};
};

export default function AdminGame() {
  const {user, game} = useLoaderData<LoaderResponse>();

  return (
    <Layout user={user}>
      <h1>
        {game.away.nickName} @ {game.home.nickName}
      </h1>
    </Layout>
  );
}
