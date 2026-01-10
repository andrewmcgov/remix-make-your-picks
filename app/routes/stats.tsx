import {LoaderFunction, MetaFunction} from 'react-router';
import {useLoaderData} from 'react-router';
import {Layout} from '~/components/Layout';
import {getUserStats} from '~/utilities/stats.server';
import {currentUser} from '~/utilities/user.server';
import {SafeUser, UserStatsWithUser} from '~/utilities/types';

interface LoaderResponse {
  user: SafeUser | null;
  stats: UserStatsWithUser[];
}

export const meta: MetaFunction = () => {
  return [
    {
      title: 'User Stats | Make your picks',
    },
    {name: 'description', content: 'User statistics for playoff picks'},
  ];
};

export const loader: LoaderFunction = async ({request}) => {
  const user = await currentUser(request);
  const stats = await getUserStats();

  return {user, stats};
};

export default function Stats() {
  const {user, stats} = useLoaderData<LoaderResponse>();

  return (
    <Layout user={user}>
      <div className="AdminHeading">
        <h1>All time stats</h1>
      </div>
      <div className="card">
        {stats.length === 0 ? (
          <p>No statistics available yet. Ask an admin to calculate stats.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Total Playoff Games</th>
                <th>Correct Picks</th>
                <th>Correct %</th>
                <th>Best Position</th>
                <th>Avg Position</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((stat) => (
                <tr key={stat.userId}>
                  <td>{stat.user.username}</td>
                  <td>{stat.totalPlayoffGamesPicked}</td>
                  <td>{stat.totalCorrectPicks}</td>
                  <td>{stat.correctPickPercentage.toFixed(1)}%</td>
                  <td>
                    {stat.bestLeaderboardPosition
                      ? stat.bestLeaderboardPosition
                      : '-'}
                  </td>
                  <td>
                    {stat.averageLeaderboardPosition
                      ? stat.averageLeaderboardPosition.toFixed(1)
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
