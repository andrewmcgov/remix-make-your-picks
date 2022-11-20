import {MetaFunction, LoaderFunction} from '@remix-run/node';
import {useLoaderData} from '@remix-run/react';
import {Layout} from '~/components/Layout';
import {LeaderboardTable} from '~/components/LeaderboardTable';
import {getLeaderboard} from '~/utilities/leaderboard.server';
import {LeaderboardEntryWithUserAndTotal, SafeUser} from '~/utilities/types';
import {currentUser} from '~/utilities/user.server';

interface LoaderResponse {
  user: SafeUser | null;
  leaderboard: LeaderboardEntryWithUserAndTotal[];
}

export const meta: MetaFunction = () => {
  return {
    title: 'Leaderboard | Make your picks',
    description: 'NFL playoff picks',
  };
};

export let loader: LoaderFunction = async ({request}) => {
  const user = await currentUser(request);
  const leaderboard = await getLeaderboard();

  return {user, leaderboard};
};

export default function Leaderboard() {
  const {user, leaderboard} = useLoaderData<LoaderResponse>();

  return (
    <Layout user={user}>
      <h1>Leaderboard</h1>
      <div className="card">
        <LeaderboardTable leaderboard={leaderboard} />
      </div>
    </Layout>
  );
}
