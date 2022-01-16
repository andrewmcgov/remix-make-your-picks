import {LeaderboardEntryWithUserAndTotal} from '~/utilities/types';

export interface LeaderboardTableProps {
  leaderboard?: LeaderboardEntryWithUserAndTotal[];
}

export function LeaderboardTable({leaderboard}: LeaderboardTableProps) {
  return (
    <>
      <div className="leaderboard-legend">
        <p>
          <strong>Points per correct pick</strong>
        </p>
        <p>Wildcard: 2, Divisional: 2, Conference: 4, Superbowl: 5</p>
      </div>
      <div className="scroll">
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>User</th>
              <th>Wildcard</th>
              <th>Divisional</th>
              <th>Conference</th>
              <th>Superbowl</th>
              <th>Total</th>
            </tr>
            {leaderboard?.map((entry, index) => (
              <tr key={entry.id}>
                <td>{index + 1}</td>
                <td>{entry.user.username}</td>
                <td>{entry.wildcard}</td>
                <td>{entry.division}</td>
                <td>{entry.conference}</td>
                <td>{entry.superbowl}</td>
                <td>{entry.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
