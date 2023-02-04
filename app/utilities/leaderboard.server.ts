import {User} from '@prisma/client';
import {db} from './db.server';
import {hasGameStarted} from './games';
import {defaultSeason} from './static-data';
import {Errors, SafeUser, PickWithGame} from './types';
import {isAdmin} from './user';

export async function updateLeaderboard(user: SafeUser) {
  const errors: Errors = {};
  const season = defaultSeason;

  if (!isAdmin(user)) {
    errors.message = 'Only admins can update the leaderboard';
    return {errors};
  }

  const allUsers = await db.user.findMany();

  try {
    await Promise.all(
      allUsers.map(async (user) => {
        return await updateLeaderboardEntryForUser(user, season);
      })
    );
  } catch (error) {
    console.error(error);
    errors.message = 'error updating leaderboards';
    return {errors};
  }

  return {success: true};
}

export async function updateLeaderboardEntryForUser(
  user: User,
  season: string
) {
  const leaderBoardEntry = await findOrCreateLeaderboardEntry(user.id, season);

  const userPIcks = await db.pick.findMany({
    where: {userId: user.id},
    include: {game: true},
  });

  const {
    correctWildcardPicks,
    correctDivisionPicks,
    correctConferencePicks,
    correctSuperbowlPicks,
  } = filterCorrectPicksByWeek(userPIcks, season);

  const updatedLeaderboardEntry = {
    wildcard: correctWildcardPicks.length * 2,
    division: correctDivisionPicks.length * 2,
    conference: correctConferencePicks.length * 4,
    superbowl: correctSuperbowlPicks.length * 5,
  };

  return await db.leaderboardEntry.update({
    where: {id: leaderBoardEntry.id},
    data: updatedLeaderboardEntry,
  });
}

async function findOrCreateLeaderboardEntry(userId: number, season: string) {
  const existingEntry = await db.leaderboardEntry.findFirst({
    where: {
      season,
      userId,
    },
  });

  if (existingEntry) {
    return existingEntry;
  }

  return await db.leaderboardEntry.create({
    data: {
      user: {connect: {id: userId}},
      season: season,
      wildcard: 0,
      division: 0,
      conference: 0,
      superbowl: 0,
    },
  });
}

function filterCorrectPicksByWeek(picks: PickWithGame[], season: string) {
  const correctWildcardPicks: PickWithGame[] = [];
  const correctDivisionPicks: PickWithGame[] = [];
  const correctConferencePicks: PickWithGame[] = [];
  const correctSuperbowlPicks: PickWithGame[] = [];

  picks.forEach((pick) => {
    if (!pick.correct || !pick.game || pick.game.season !== season) {
      return;
    }

    switch (pick.game.week) {
      case 'WC':
        correctWildcardPicks.push(pick);
        break;
      case 'DIV':
        correctDivisionPicks.push(pick);
        break;
      case 'CC':
        correctConferencePicks.push(pick);
        break;
      case 'SB':
        correctSuperbowlPicks.push(pick);
        break;
      default:
        break;
    }
  });

  return {
    correctWildcardPicks,
    correctDivisionPicks,
    correctConferencePicks,
    correctSuperbowlPicks,
  };
}

export async function getLeaderboard(season: string = defaultSeason) {
  let leaderboard = await db.leaderboardEntry.findMany({
    where: {season},
    include: {user: {select: {id: true, username: true}}},
  });

  const tieBreakers = await db.tieBreaker.findMany({
    where: {season},
    include: {user: {select: {id: true, username: true}}},
  });

  const superbowl = await db.game.findFirst({
    where: {season, week: 'SB'},
  });

  const superbowlClosed =
    typeof superbowl?.homeScore === 'number' &&
    typeof superbowl?.awayScore === 'number';
  const superbowlStarted = superbowl && hasGameStarted(superbowl);
  console.log({superbowlStarted, superbowlClosed});

  // Filter out test user in prod
  if (process.env.NODE_ENV !== 'development') {
    leaderboard = leaderboard.filter((entry) => entry.userId !== 1);
  }

  return leaderboard
    .map((entry) => {
      const tieBreakerValue = superbowlStarted
        ? tieBreakers.find((tieBreaker) => tieBreaker.userId === entry.userId)
            ?.value
        : undefined;

      const diff =
        tieBreakerValue &&
        // Would just use superbowlClosed here, but TS doesn't like it
        typeof superbowl?.homeScore === 'number' &&
        typeof superbowl?.awayScore === 'number'
          ? tieBreakerValue - (superbowl.homeScore + superbowl.awayScore)
          : undefined;
      return {
        ...entry,
        total:
          entry.wildcard + entry.division + entry.conference + entry.superbowl,
        diff: superbowlStarted ? diff : undefined,
        tieBreaker: superbowlStarted ? tieBreakerValue : undefined,
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

        // If guesses are the same distance from the total score eg: -5 ,+5,
        // favor the one that did not guess the over
        if (Math.abs(diffA) === Math.abs(diffB)) {
          return diffA > diffB ? 1 : -1;
        }

        return Math.abs(diffA) - Math.abs(diffB);
      }

      return b.total - a.total;
    });
}
