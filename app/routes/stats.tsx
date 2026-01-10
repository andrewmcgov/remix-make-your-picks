import {LoaderFunction, MetaFunction} from 'react-router';
import {Link, useLoaderData, useSearchParams} from 'react-router';
import {Layout} from '~/components/Layout';
import {getUserStats} from '~/utilities/stats.server';
import {currentUser} from '~/utilities/user.server';
import {SafeUser, UserStatsWithUser} from '~/utilities/types';

interface LoaderResponse {
  user: SafeUser | null;
  stats: UserStatsWithUser[];
}

type SortField =
  | 'username'
  | 'totalPlayoffGamesPicked'
  | 'totalCorrectPicks'
  | 'correctPickPercentage'
  | 'bestLeaderboardPosition'
  | 'averageLeaderboardPosition';

type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
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

function parseSortParam(sortBy: string | null): SortConfig {
  const defaultSort: SortConfig = {
    field: 'correctPickPercentage',
    direction: 'desc',
  };

  if (!sortBy) return defaultSort;

  const parts = sortBy.split('-');
  const field = parts[0] as SortField;
  const direction = parts[1] as SortDirection | undefined;

  // Validate field
  const validFields: SortField[] = [
    'username',
    'totalPlayoffGamesPicked',
    'totalCorrectPicks',
    'correctPickPercentage',
    'bestLeaderboardPosition',
    'averageLeaderboardPosition',
  ];

  if (!validFields.includes(field)) return defaultSort;

  // Default direction based on field type
  let defaultDirection: SortDirection = 'desc';
  if (
    field === 'bestLeaderboardPosition' ||
    field === 'averageLeaderboardPosition'
  ) {
    defaultDirection = 'asc'; // Lower position is better
  }

  return {
    field,
    direction:
      direction === 'asc' || direction === 'desc'
        ? direction
        : defaultDirection,
  };
}

function sortStats(
  stats: UserStatsWithUser[],
  config: SortConfig
): UserStatsWithUser[] {
  const {field, direction} = config;
  const sorted = [...stats];

  sorted.sort((a, b) => {
    let aValue: string | number | null;
    let bValue: string | number | null;

    if (field === 'username') {
      aValue = a.user.username.toLowerCase();
      bValue = b.user.username.toLowerCase();
    } else {
      aValue = a[field];
      bValue = b[field];
    }

    // Handle null values - always put them at the end
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return 1;
    if (bValue === null) return -1;

    // Compare values
    let comparison = 0;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    }

    return direction === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

function getSortUrl(
  currentField: SortField,
  currentDirection: SortDirection,
  newField: SortField
): string {
  // If clicking the same field, toggle direction
  if (currentField === newField) {
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    return `?sortBy=${newField}-${newDirection}`;
  }

  // For new field, use default direction
  if (
    newField === 'bestLeaderboardPosition' ||
    newField === 'averageLeaderboardPosition'
  ) {
    return `?sortBy=${newField}-asc`;
  }

  return `?sortBy=${newField}-desc`;
}

export default function Stats() {
  const {user, stats} = useLoaderData<LoaderResponse>();
  const [searchParams] = useSearchParams();
  const sortConfig = parseSortParam(searchParams.get('sortBy'));
  const sortedStats = sortStats(stats, sortConfig);

  const SortableHeader = ({
    field,
    label,
  }: {
    field: SortField;
    label: string;
  }) => {
    const isActive = sortConfig.field === field;
    const sortUrl = getSortUrl(sortConfig.field, sortConfig.direction, field);

    return (
      <th>
        <Link
          to={sortUrl}
          style={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          {label}
          <span
            style={{
              fontSize: '0.75em',
              opacity: isActive ? 1 : 0,
            }}
          >
            {sortConfig.direction === 'asc' ? '▲' : '▼'}
          </span>
        </Link>
      </th>
    );
  };

  return (
    <Layout user={user}>
      <div className="AdminHeading">
        <h1>All time stats</h1>
      </div>
      <div className="card">
        {stats.length === 0 ? (
          <p>No statistics available yet. Ask an admin to calculate stats.</p>
        ) : (
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <SortableHeader field="username" label="Username" />
                  <SortableHeader
                    field="totalPlayoffGamesPicked"
                    label="Total picks"
                  />
                  <SortableHeader
                    field="totalCorrectPicks"
                    label="Correct picks"
                  />
                  <SortableHeader
                    field="correctPickPercentage"
                    label="Correct %"
                  />
                  <SortableHeader
                    field="bestLeaderboardPosition"
                    label="Best position"
                  />
                  <SortableHeader
                    field="averageLeaderboardPosition"
                    label="Avg position"
                  />
                </tr>
              </thead>
              <tbody>
                {sortedStats.map((stat, index) => (
                  <tr key={stat.userId}>
                    <td>{index + 1}</td>
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
          </div>
        )}
      </div>
    </Layout>
  );
}
