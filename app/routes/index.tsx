import {MetaFunction, LoaderFunction, useLoaderData} from 'remix';
import {currentUser} from '~/utilities/user.server';
import {Layout} from '~/components/layout';
import {SafeUser, IndexGame} from '~/utilities/types';
import {db} from '~/utilities/db.server';
import {GameCard} from '~/components/GameCard';
import {GameFilter} from '~/components/GameFilter';

// https://remix.run/api/conventions#meta
export const meta: MetaFunction = () => {
  return {
    title: 'Make your picks',
    description: 'NFL playoff picks',
  };
};

interface IndexLoaderResponse {
  user: SafeUser | null;
  games: IndexGame[];
}

export let loader: LoaderFunction = async ({request}) => {
  const user = await currentUser(request);
  let url = new URL(request.url);
  const week = url.searchParams.get('week') || '16';
  const season = url.searchParams.get('season') || '2020';

  let games = await db.game.findMany({
    where: {
      week,
      season,
    },
    include: {
      home: true,
      away: true,
      picks: {include: {team: true, user: {select: {username: true}}}},
    },
  });

  return {user, games};
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const {user, games} = useLoaderData<IndexLoaderResponse>();

  return (
    <Layout user={user}>
      <GameFilter />
      <div className="game-list">
        {games.map((game) => {
          return <GameCard key={game.id} game={game} />;
        })}
      </div>
    </Layout>
  );
}
