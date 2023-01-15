import {PrismaClient} from '@prisma/client';

const db = new PrismaClient();

async function deleteAllPicks() {
  console.log('Deleting all picks...');
  await db.pick.deleteMany({});
  console.log('Deleted all picks');
}

async function deleteAllGames() {
  console.log('Deleting all games...');
  await db.game.deleteMany({});
  console.log('Deleted all games');
}

async function deleteAllUsers() {
  console.log('Deleting all users...');
  await db.user.deleteMany({});
  console.log('Deleted all users');
}

(async () => {
  await deleteAllPicks();
  await deleteAllGames();
  await deleteAllUsers();
})();
