import {PrismaClient} from '@prisma/client';
import {faker} from '@faker-js/faker';
import {Team} from '@prisma/client';
import bcrypt from 'bcrypt';
import {updateLeaderboardEntryForUser} from '../app/utilities/leaderboard.server';

const db = new PrismaClient();

const SEASONS = ['2020', '2021', '2022', '2023', '2024', '2025'];

function shuffle(array: any[]) {
  array.sort(() => Math.random() - 0.5);
}

function getGamesforSeason(season: string, allTeams: Team[]) {
  const teams = [...allTeams];
  shuffle(teams);
  const startTime = new Date(`01/02/${season}`);
  return [
    {
      homeId: teams[0].id,
      awayId: teams[1].id,
      week: 'WC',
      start: startTime,
      season,
      league: 'NFL',
      isPlayoff: true,
    },
    {
      homeId: teams[2].id,
      awayId: teams[3].id,
      week: 'WC',
      start: startTime,
      season,
      league: 'NFL',
      isPlayoff: true,
    },
    {
      homeId: teams[4].id,
      awayId: teams[5].id,
      week: 'WC',
      start: startTime,
      season,
      league: 'NFL',
      isPlayoff: true,
    },
    {
      homeId: teams[6].id,
      awayId: teams[7].id,
      week: 'WC',
      start: startTime,
      season,
      league: 'NFL',
      isPlayoff: true,
    },
    {
      homeId: teams[8].id,
      awayId: teams[9].id,
      week: 'WC',
      start: startTime,
      season,
      league: 'NFL',
      isPlayoff: true,
    },
    {
      homeId: teams[10].id,
      awayId: teams[11].id,
      week: 'WC',
      start: startTime,
      season,
      league: 'NFL',
      isPlayoff: true,
    },
    {
      homeId: teams[0].id,
      awayId: teams[1].id,
      week: 'DIV',
      start: startTime,
      season,
      league: 'NFL',
      isPlayoff: true,
    },
    {
      homeId: teams[2].id,
      awayId: teams[3].id,
      week: 'DIV',
      start: startTime,
      season,
      league: 'NFL',
      isPlayoff: true,
    },
    {
      homeId: teams[4].id,
      awayId: teams[5].id,
      week: 'DIV',
      start: startTime,
      season,
      league: 'NFL',
      isPlayoff: true,
    },
    {
      homeId: teams[6].id,
      awayId: teams[7].id,
      week: 'DIV',
      start: startTime,
      season,
      league: 'NFL',
      isPlayoff: true,
    },
    {
      homeId: teams[7].id,
      awayId: teams[13].id,
      week: 'CC',
      start: startTime,
      season,
      league: 'NFL',
      isPlayoff: true,
    },
    {
      homeId: teams[12].id,
      awayId: teams[1].id,
      week: 'CC',
      start: startTime,
      season,
      league: 'NFL',
      isPlayoff: true,
    },
    {
      homeId: teams[7].id,
      awayId: teams[1].id,
      week: 'SB',
      start: startTime,
      season,
      league: 'NFL',
      isPlayoff: true,
    },
  ];
}

(async () => {
  const teams = await db.team.findMany();

  if (teams.length === 0) {
    throw new Error(
      'There are no teams in the database. Please seed the teams first.'
    );
  }

  console.log(`${teams.length} teams found in the database`);

  console.log('Creating games...');
  await Promise.all(
    SEASONS.map(async (season) => {
      // make 6 games for wildcard weekend
      await db.game.createMany({
        data: getGamesforSeason(season, teams),
      });
    })
  );
  console.log('Games created!');

  console.log('Creating users...');
  const mockPassword = await bcrypt.hash('test', 10);
  await db.user.createMany({
    data: [
      {
        username: 'Big Tester 76',
        email: 'test@test.com',
        password: mockPassword,
      },
      ...Array(10)
        .fill('')
        .map(() => {
          return {
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: mockPassword,
          };
        }),
    ],
  });
  console.log('Users created!');

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

  const allGamesWithPicks = await db.game.findMany({
    include: {
      picks: true,
    },
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

  console.log('Creating leaderboards and tiebreakers...');
  await Promise.all(
    SEASONS.map(async (season) => {
      Promise.all(
        allUsers.map(async (user) => {
          Promise.all([
            db.tieBreaker.create({
              data: {
                season,
                userId: user.id,
                value: faker.datatype.number({min: 10, max: 90}),
              },
            }),
            updateLeaderboardEntryForUser(user, season),
          ]);
        })
      );
    })
  );
  console.log('Leaderboards and tiebreakers created!');

  console.log('DB seeded with teams, users, games, picks, and leaderboards!');
})();
