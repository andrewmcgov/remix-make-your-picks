import {MetaFunction, LoaderFunction, ActionFunction} from '@remix-run/node';
import {useLoaderData} from '@remix-run/react';
import {currentUser} from '~/utilities/user.server';
import {Layout} from '~/components/Layout';
import {SafeUser, IndexGame} from '~/utilities/types';
import {db} from '~/utilities/db.server';
import {GameCard} from '~/components/GameCard';
import {GameFilter} from '~/components/GameFilter';
import {hasGameStarted} from '~/utilities/games';
import {gameFilters} from '~/utilities/games.server';
import {TieBreakerCard} from '~/components/TieBreakerCard';
import {createOrUpdateTiebreaker} from './tiebreaker.server';
import {Confetti} from '~/components/Confetti';

export const meta: MetaFunction = () => {
  return {
    title: 'Make your picks',
    description: 'NFL playoff picks',
  };
};

interface IndexLoaderResponse {
  user: SafeUser | null;
  games: IndexGame[];
  userTieBreaker?: number;
}

export let loader: LoaderFunction = async ({request}) => {
  const user = await currentUser(request);
  const {week, season} = gameFilters(request);

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

  const tieBreakers =
    week === 'SB'
      ? await db.tieBreaker.findMany({
          where: {
            season,
          },
          include: {
            user: {select: {id: true}},
          },
        })
      : null;

  const hasSuperBowlStarted =
    week === 'SB' && games[0] && hasGameStarted(games[0]);

  games = user
    ? games.map((game) => {
        const gameStarted = hasGameStarted(game);
        return {
          ...game,
          homePickUsernames: gameStarted
            ? game.picks
                .filter((pick) => game.homeId === pick.teamId)
                .map((pick) => {
                  const tieBreaker =
                    hasSuperBowlStarted &&
                    tieBreakers?.find((tb) => tb.userId === pick.userId);

                  return tieBreaker
                    ? `${pick.user.username} (${tieBreaker.value})`
                    : pick.user.username;
                })
            : [],
          awayPickUsernames: gameStarted
            ? game.picks
                .filter((pick) => game.awayId === pick.teamId)
                .map((pick) => {
                  const tieBreaker =
                    hasSuperBowlStarted &&
                    tieBreakers?.find((tb) => tb.userId === pick.userId);

                  return tieBreaker
                    ? `${pick.user.username} (${tieBreaker.value})`
                    : pick.user.username;
                })
            : [],
          picks: [],
          userPick: game.picks.find((pick) => pick.userId === user?.id),
        };
      })
    : games;

  return {
    user,
    games,
    userTieBreaker: tieBreakers?.find((tb) => tb.userId === user?.id)?.value,
  };
};

export const action: ActionFunction = ({request}) => {
  return createOrUpdateTiebreaker(request);
};

export default function Index() {
  const {user, games, userTieBreaker} = useLoaderData<IndexLoaderResponse>();
  const isSuperBowl = games.length === 1;
  const superbowlStarted = isSuperBowl && games[0] && hasGameStarted(games[0]);
  const superbowlEnded =
    isSuperBowl &&
    games[0] &&
    games[0].homeScore !== null &&
    games[0].awayScore !== null;
  const homeWinsSuperBowl =
    isSuperBowl &&
    games[0] &&
    games[0].homeScore !== null &&
    games[0].awayScore !== null &&
    games[0].homeScore > games[0].awayScore;

  return (
    <Layout user={user}>
      <GameFilter />
      {games.length > 0 ? (
        <div
          className={`game-list ${isSuperBowl ? 'game-list-superbowl' : ''}`}
        >
          {isSuperBowl ? (
            <TieBreakerCard
              userTieBreaker={userTieBreaker}
              superbowlStarted={superbowlStarted}
            />
          ) : null}
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
      {superbowlEnded ? <Confetti homeWins={homeWinsSuperBowl} /> : null}
    </Layout>
  );
}
