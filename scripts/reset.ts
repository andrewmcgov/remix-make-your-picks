import * as readline from 'node:readline/promises';
import {stdin as input, stdout as output} from 'node:process';
import dotenv from 'dotenv';
import {PrismaClient} from '@prisma/client';

const rl = readline.createInterface({input, output});
const db = new PrismaClient();
dotenv.config();

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

async function deleteAllLeaderboards() {
  console.log('Deleting all leaderboards...');
  await db.leaderboardEntry.deleteMany({});
  console.log('Deleted all leaderboards');
}

async function deleteAllLeaderboardEntries() {
  console.log('Deleting all leaderboard entries...');
  await db.leaderboardEntry.deleteMany({});
  console.log('Deleted all leaderboard entries');
}

async function deleteAllUsers() {
  console.log('Deleting all users...');
  await db.user.deleteMany({});
  console.log('Deleted all users');
}

(async () => {
  if (!process.env.DATABASE_URL?.includes('localhost')) {
    console.error('This script can only be run locally.');
    return;
  }

  const answer = await rl.question(
    'Are you sure you want to delete all data? (y/n): '
  );

  rl.close();

  if (answer !== 'y') {
    console.log('Aborting...');
    return;
  }

  await deleteAllPicks();
  await deleteAllGames();
  await deleteAllLeaderboards();
  await deleteAllLeaderboardEntries();
  await deleteAllUsers();
  console.log('Done!');
})();
