import {PrismaClient} from '@prisma/client';
import {nflTeams} from './teams';

const db = new PrismaClient();

export async function seedTeams() {
  console.log('Seeding teams in the database');
  try {
    const teams = await db.team.createMany({
      data: nflTeams,
    });

    if (teams.count > 1) {
      console.log('Seeded teams in the database');
    } else {
      console.error('Error seeding teams in the database..');
    }
  } catch (error) {
    console.error(error);
  }
}

seedTeams();
