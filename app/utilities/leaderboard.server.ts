import {User} from '@prisma/client';
import {db} from './db.server';
import {Errors, SafeUser, PickWithGame} from './types';
import {isAdmin} from './user';

export async function updateLeaderboard(user: SafeUser) {
  const errors: Errors = {};
  const season = '2021';

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

async function updateLeaderboardEntryForUser(user: User, season: string) {
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
