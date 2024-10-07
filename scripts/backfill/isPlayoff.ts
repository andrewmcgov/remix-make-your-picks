import dotenv from 'dotenv';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

dotenv.config();

const playoffWeeks = ['WC', 'DIV', 'CC', 'SB'];

async function backfillIsPlayoff() {
  let playoffCount = 0;
  let notPlayoffCount = 0;
  const games = await prisma.game.findMany({
    select: {
      id: true,
      week: true,
    },
  });

  console.log(`Updating ${games.length} games`);

  for (const game of games) {
    if (playoffWeeks.includes(game.week)) {
      await prisma.game.update({
        where: {id: game.id},
        data: {
          isPlayoff: true,
        },
      });
      playoffCount++;
    } else {
      notPlayoffCount++;
    }
  }

  console.log(`Updated ${playoffCount} games as playoff games`);
  console.log(`Updated ${notPlayoffCount} games as not playoff games`);

  console.log('Done!');
}

backfillIsPlayoff();
