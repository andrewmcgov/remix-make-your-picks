import {PrismaClient} from '@prisma/client';
import {faker} from '@faker-js/faker';

const db = new PrismaClient();

const SEASONS = ['2020', '2021', '2022'];

(async () => {
  // Check to make sure that the teams have already been seeded, if not, throw an error
  const teams = await db.team.findMany();

  if (teams.length === 0) {
    throw new Error(
      'There are no teams in the database. Please seed the teams first.'
    );
  }

  console.log(`${teams.length} teams found in the database`);

  // Make a bunch of games for each week of playoffs in all available seasons

  // Chose 14 teams to be involved in the playoffs
  const playoffTeams = teams.slice(0, 14);

  console.log('Creating games...');
  await Promise.all(
    SEASONS.map(async (season) => {
      // make 6 games for wildcard weekend
      const games = await db.game.createMany({
        data: [
          {
            homeId: playoffTeams[0].id,
            awayId: playoffTeams[1].id,
            week: 'WC',
            start: faker.datatype.datetime(),
            season,
            league: 'NFL',
          },
          {
            homeId: playoffTeams[2].id,
            awayId: playoffTeams[3].id,
            week: 'WC',
            start: faker.datatype.datetime(),
            season,
            league: 'NFL',
          },
          {
            homeId: playoffTeams[4].id,
            awayId: playoffTeams[5].id,
            week: 'WC',
            start: faker.datatype.datetime(),
            season,
            league: 'NFL',
          },
          {
            homeId: playoffTeams[6].id,
            awayId: playoffTeams[7].id,
            week: 'WC',
            start: faker.datatype.datetime(),
            season,
            league: 'NFL',
          },
          {
            homeId: playoffTeams[8].id,
            awayId: playoffTeams[9].id,
            week: 'WC',
            start: faker.datatype.datetime(),
            season,
            league: 'NFL',
          },
          {
            homeId: playoffTeams[10].id,
            awayId: playoffTeams[11].id,
            week: 'WC',
            start: faker.datatype.datetime(),
            season,
            league: 'NFL',
          },
          {
            homeId: playoffTeams[0].id,
            awayId: playoffTeams[1].id,
            week: 'DIV',
            start: faker.datatype.datetime(),
            season,
            league: 'NFL',
          },
          {
            homeId: playoffTeams[2].id,
            awayId: playoffTeams[3].id,
            week: 'DIV',
            start: faker.datatype.datetime(),
            season,
            league: 'NFL',
          },
          {
            homeId: playoffTeams[4].id,
            awayId: playoffTeams[5].id,
            week: 'DIV',
            start: faker.datatype.datetime(),
            season,
            league: 'NFL',
          },
          {
            homeId: playoffTeams[6].id,
            awayId: playoffTeams[7].id,
            week: 'DIV',
            start: faker.datatype.datetime(),
            season,
            league: 'NFL',
          },
          {
            homeId: playoffTeams[7].id,
            awayId: playoffTeams[13].id,
            week: 'CC',
            start: faker.datatype.datetime(),
            season,
            league: 'NFL',
          },
          {
            homeId: playoffTeams[12].id,
            awayId: playoffTeams[1].id,
            week: 'CC',
            start: faker.datatype.datetime(),
            season,
            league: 'NFL',
          },
          {
            homeId: playoffTeams[12].id,
            awayId: playoffTeams[1].id,
            week: 'CC',
            start: faker.datatype.datetime(),
            season,
            league: 'NFL',
          },
        ],
      });
    })
  );
  console.log('Games created!');

  // Make 10 users
  console.log('Creating users...');
  const users = await db.user.createMany({
    data: Array(10)
      .fill('')
      .map(() => {
        return {
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        };
      }),
  });
  console.log('Users created!');

  // Pick all games for all users
  const allUsers = await db.user.findMany();
  const allGames = await db.game.findMany();

  console.log('Creating picks for all games...');
  await Promise.all(
    allUsers.map(async (user) => {
      const picks = allGames.map((game) => {
        return {
          user: {connect: {id: user.id}},
          game: {connect: {id: game.id}},
          team: {
            connect: {
              id: faker.datatype.boolean() ? game.homeId : game.awayId,
            },
          },
        };
      });

      await Promise.all(
        picks.map(async (pick) => await db.pick.create({data: pick}))
      );
    })
  );
  console.log('Picks created!');

  // close all games

  const allGamesWithPicks = await db.game.findMany({
    include: {
      picks: true,
    },
  });

  console.log({
    allGamesCount: allGames.length,
    allGamesWithPicksCount: allGamesWithPicks.length,
  });

  console.log('Closing games and assigning winners...');
  await Promise.all(
    allGamesWithPicks.map(async (game) => {
      const winner = faker.datatype.boolean() ? game.homeId : game.awayId;
      const winnerScore = faker.datatype.number({min: 10, max: 50});
      const loserScore =
        winnerScore - faker.datatype.number({min: 1, max: winnerScore});
      await db.game.update({
        where: {id: game.id},
        data: {
          winnerId: winner,
          homeScore: winner === game.homeId ? winnerScore : loserScore,
          awayScore: winner === game.awayId ? winnerScore : loserScore,
        },
      });

      await Promise.all(
        game.picks.map(async (pick) => {
          await db.pick.update({
            where: {id: pick.id},
            data: {
              correct: pick.teamId === winner,
              closed: true,
            },
          });
        })
      );
    })
  );

  console.log('DB seeded with teams, users, games, and picks!');
})();
