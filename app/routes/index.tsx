import {MetaFunction, LoaderFunction, useLoaderData} from 'remix';
import {currentUser} from '~/utilities/user.server';
import {Layout} from '~/components/Layout';
import {SafeUser, IndexGame} from '~/utilities/types';
import {db} from '~/utilities/db.server';
import {GameCard} from '~/components/GameCard';
import {GameFilter} from '~/components/GameFilter';
import {defaultWeek, defaultSeason} from '../utilities/static-data';
import { hasGameStarted } from '~/utilities/games';

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
      picks: {include: {team: true, user: {select: {username: true}}}},
    },
  });

  games = user
    ? games.map((game) => {
        const gameStarted = hasGameStarted(game);
        return {
          ...game,
          homePickUsernames: gameStarted ? game.picks
            .filter((pick) => game.homeId === pick.teamId)
            .map((pick) => pick.user.username) : [],
          awayPickUsernames: gameStarted ? game.picks
            .filter((pick) => game.awayId === pick.teamId)
            .map((pick) => pick.user.username) : [],
          picks: [],
          userPick: game.picks.find((pick) => pick.userId === user?.id),
        };
      })
    : games;

  return {user, games};
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const {user, games} = useLoaderData<IndexLoaderResponse>();

  return (
    <Layout user={user}>
      <GameFilter />
      {games.length > 0 ? (
        <div className="game-list">
          {games.map((game) => {
            return <GameCard key={game.id} game={game} user={user} />;
          })}
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
