import {LoaderFunction, useLoaderData} from 'remix';
import {Layout} from '~/components/Layout';
import {LeaderboardTable} from '~/components/LeaderboardTable';
import {getLeaderboard} from '~/utilities/leaderboard.server';
import {LeaderboardEntryWithUser, SafeUser} from '~/utilities/types';
import {currentUser} from '~/utilities/user.server';

interface LoaderResponse {
  user: SafeUser | null;
  leaderboard: LeaderboardEntryWithUser[];
}

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
