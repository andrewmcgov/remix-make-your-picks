import {db} from './db.server';
import {UserStatsWithUser} from './types';

/**
 * Calculate statistics for a single user based on their playoff picks
 * and leaderboard positions in finished seasons
 */
export async function calculateUserStats(userId: number) {
  // Get all picks for playoff games
  const playoffPicks = await db.pick.findMany({
    where: {
      userId,
      game: {
        isPlayoff: true,
      },
    },
    include: {
      game: true,
    },
  });

  const totalPlayoffGamesPicked = playoffPicks.length;
  const totalCorrectPicks = playoffPicks.filter(
    (pick) => pick.correct === true
  ).length;

  const correctPickPercentage =
    totalPlayoffGamesPicked > 0
      ? (totalCorrectPicks / totalPlayoffGamesPicked) * 100
      : 0;

  // Get finished seasons and calculate leaderboard positions
  const finishedSeasons = await getFinishedSeasons();
  const leaderboardPositions: number[] = [];

  for (const season of finishedSeasons) {
    const leaderboard = await getLeaderboardWithPositions(season);
    const userPosition = leaderboard.find(
      (entry) => entry.userId === userId
    )?.position;

    if (userPosition !== undefined) {
      leaderboardPositions.push(userPosition);
    }
  }

  const bestLeaderboardPosition =
    leaderboardPositions.length > 0 ? Math.min(...leaderboardPositions) : null;

  const averageLeaderboardPosition =
    leaderboardPositions.length > 0
      ? leaderboardPositions.reduce((sum, pos) => sum + pos, 0) /
        leaderboardPositions.length
      : null;

  // Upsert the stats
  return await db.userStats.upsert({
    where: {userId},
    create: {
      userId,
      totalPlayoffGamesPicked,
      totalCorrectPicks,
      correctPickPercentage,
      bestLeaderboardPosition,
      averageLeaderboardPosition,
    },
    update: {
      totalPlayoffGamesPicked,
      totalCorrectPicks,
      correctPickPercentage,
      bestLeaderboardPosition,
      averageLeaderboardPosition,
    },
  });
}

/**
 * Recalculate stats for all users
 * Returns a summary of the operation
 */
export async function recalculateAllStats() {
  const allUsers = await db.user.findMany({
    select: {id: true, username: true},
  });

  const results = {
    total: allUsers.length,
    successful: 0,
    failed: 0,
    errors: [] as {userId: number; username: string; error: string}[],
  };

  for (const user of allUsers) {
    try {
      await calculateUserStats(user.id);
      results.successful++;
    } catch (error) {
      results.failed++;
      results.errors.push({
        userId: user.id,
        username: user.username,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      console.error(`Error calculating stats for user ${user.id}:`, error);
    }
  }

  return results;
}

/**
 * Get user stats, optionally filtered by userId
 * Returns stats with user information
 */
export async function getUserStats(
  userId?: number
): Promise<UserStatsWithUser[]> {
  const where = userId ? {userId} : {};

  const stats = await db.userStats.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: {
      correctPickPercentage: 'desc',
    },
  });

  // Filter out test user in production
  if (process.env.NODE_ENV !== 'development') {
    return stats.filter((stat) => stat.userId !== 1);
  }

  return stats;
}

/**
 * Get all seasons where the Super Bowl has been completed (has scores)
 * A season is considered finished when the SB game has both homeScore and awayScore set
 */
async function getFinishedSeasons(): Promise<string[]> {
  const superbowlGames = await db.game.findMany({
    where: {
      week: 'SB',
      homeScore: {not: null},
      awayScore: {not: null},
    },
    select: {
      season: true,
    },
    distinct: ['season'],
  });

  return superbowlGames.map((game) => game.season);
}

/**
 * Get leaderboard for a specific season with positions calculated
 * Similar to getLeaderboard in leaderboard.server.ts but includes position
 */
async function getLeaderboardWithPositions(season: string) {
  const leaderboard = await db.leaderboardEntry.findMany({
    where: {season},
    include: {
      user: {
        select: {id: true, username: true},
      },
    },
  });

  const tieBreakers = await db.tieBreaker.findMany({
    where: {season},
  });

  const superbowl = await db.game.findFirst({
    where: {season, week: 'SB'},
  });

  const superbowlClosed =
    typeof superbowl?.homeScore === 'number' &&
    typeof superbowl?.awayScore === 'number';

  // Filter out test user in production
  let filteredLeaderboard = leaderboard;
  if (process.env.NODE_ENV !== 'development') {
    filteredLeaderboard = leaderboard.filter((entry) => entry.userId !== 1);
  }

  // Sort leaderboard (same logic as leaderboard.server.ts)
  const sortedLeaderboard = filteredLeaderboard
    .map((entry) => {
      const tieBreakerValue = tieBreakers.find(
        (tb) => tb.userId === entry.userId
      )?.value;

      const diff =
        tieBreakerValue &&
        typeof superbowl?.homeScore === 'number' &&
        typeof superbowl?.awayScore === 'number'
          ? tieBreakerValue - (superbowl.homeScore + superbowl.awayScore)
          : undefined;

      return {
        ...entry,
        diff,
        tieBreaker: tieBreakerValue,
      };
    })
    .sort((a, b) => {
      if (superbowlClosed && a.total === b.total) {
        const diffA = a.diff;
        const diffB = b.diff;

        if (diffA === undefined && diffB === undefined) {
          return b.total - a.total;
        }

        if (diffA === undefined) {
          return 1;
        }

        if (diffB === undefined) {
          return -1;
        }

        if (diffA === diffB) {
          return 0;
        }

        if (Math.abs(diffA) === Math.abs(diffB)) {
          return diffA > diffB ? 1 : -1;
        }

        return Math.abs(diffA) - Math.abs(diffB);
      }

      return b.total - a.total;
    });

  // Add position to each entry
  return sortedLeaderboard.map((entry, index) => ({
    ...entry,
    position: index + 1,
  }));
}
