// backfill the leaderboard total column

import {PrismaClient} from '@prisma/client';

const db = new PrismaClient();

async function backfillLeaderboardTotal() {
  const leaderboardEntries = await db.leaderboardEntry.findMany();

  for (const entry of leaderboardEntries) {
    const total =
      entry.wildcard + entry.division + entry.conference + entry.superbowl;

    await db.leaderboardEntry.update({
      where: {id: entry.id},
      data: {total},
    });
  }

  console.log('Leaderboard total backfilled');
}

backfillLeaderboardTotal();
