const prisma = require('@prisma/client');

const db = new prisma.PrismaClient();

const teams = [
  {
    city: 'Arizona',
    name: 'Cardinals',
    abr: 'ARI',
    conf: 'NFC',
    div: 'West',
  },
  {
    city: 'Atlanta',
    name: 'Falcons',
    abr: 'ATL',
    conf: 'NFC',
    div: 'South',
  },
  {
    city: 'Baltimore',
    name: 'Ravens',
    abr: 'BAL',
    conf: 'AFC',
    div: 'North',
  },
  {
    city: 'Buffalo',
    name: 'Bills',
    abr: 'BUF',
    conf: 'AFC',
    div: 'EAST',
  },
  {
    city: 'Carolina',
    name: 'Panthers',
    abr: 'CAR',
    conf: 'NFC',
    div: 'South',
  },
  {
    city: 'Cincinnati',
    name: 'Bengals',
    abr: 'CIN',
    conf: 'AFC',
    div: 'North',
  },
  {
    city: 'Chicago',
    name: 'Bears',
    abr: 'CHI',
    conf: 'NFC',
    div: 'North',
  },
  {
    city: 'Cleveland',
    name: 'Browns',
    abr: 'CLE',
    conf: 'AFC',
    div: 'North',
  },
  {
    city: 'Dallas',
    name: 'Cowboys',
    abr: 'DAL',
    conf: 'NFC',
    div: 'East',
  },
  {
    city: 'Denver',
    name: 'Broncos',
    abr: 'DEN',
    conf: 'AFC',
    div: 'West',
  },
  {
    city: 'Detroit',
    name: 'Lions',
    abr: 'DET',
    conf: 'NFC',
    div: 'North',
  },
  {
    city: 'Green Bay',
    name: 'Packers',
    abr: 'GB',
    conf: 'NFC',
    div: 'North',
  },
  {
    city: 'Houston',
    name: 'Texans',
    abr: 'HOU',
    conf: 'AFC',
    div: 'South',
  },
  {
    city: 'Indianapolis',
    name: 'Colts',
    abr: 'IND',
    conf: 'AFC',
    div: 'South',
  },
  {
    city: 'Jacksonville',
    name: 'Jaquars',
    abr: 'JAX',
    conf: 'AFC',
    div: 'South',
  },
  {
    city: 'Kansas City',
    name: 'Chiefs',
    abr: 'KC',
    conf: 'AFC',
    div: 'West',
  },
  {
    city: 'Miami',
    name: 'Dolphins',
    abr: 'MIA',
    conf: 'AFC',
    div: 'East',
  },
  {
    city: 'Minnesota',
    name: 'Vikings',
    abr: 'MIN',
    conf: 'AFC',
    div: 'North',
  },
  {
    city: 'New England',
    name: 'Patriots',
    abr: 'NE',
    conf: 'AFC',
    div: 'East',
  },
  {
    city: 'New Orleans',
    name: 'Saints',
    abr: 'NO',
    conf: 'NFC',
    div: 'South',
  },
  {
    city: 'New York',
    name: 'Giants',
    abr: 'NYG',
    conf: 'NFC',
    div: 'East',
  },
  {
    city: 'New York',
    name: 'Jets',
    abr: 'NYJ',
    conf: 'AFC',
    div: 'East',
  },
  {
    city: 'Las Vegas',
    name: 'Raiders',
    abr: 'OAK',
    conf: 'AFC',
    div: 'West',
  },
  {
    city: 'Philadelphia',
    name: 'Eagles',
    abr: 'PHI',
    conf: 'NFC',
    div: 'East',
  },
  {
    city: 'Pittsburgh',
    name: 'Steelers',
    abr: 'PIT',
    conf: 'AFC',
    div: 'North',
  },
  {
    city: 'Los Angeles',
    name: 'Chargers',
    abr: 'LAC',
    conf: 'AFC',
    div: 'West',
  },
  {
    city: 'Seattle',
    name: 'Seahawks',
    abr: 'SEA',
    conf: 'NFC',
    div: 'West',
  },
  {
    city: 'San Francisco',
    name: '49ers',
    abr: 'SF',
    conf: 'NFC',
    div: 'West',
  },
  {
    city: 'Los Angeles',
    name: 'Rams',
    abr: 'LAR',
    conf: 'NFC',
    div: 'West',
  },
  {
    city: 'Tampa Bay',
    name: 'Buccaneers',
    abr: 'TB',
    conf: 'NFC',
    div: 'South',
  },
  {
    city: 'Tennessee',
    name: 'Titans',
    abr: 'TEN',
    conf: 'AFC',
    div: 'South',
  },
  {
    city: 'Washington',
    name: 'Football Team',
    abr: 'WAS',
    conf: 'NFC',
    div: 'East',
  },
];

const nflTeams = teams.map(({city, name, abr}) => {
  return {
    city,
    fullName: city + ' ' + name,
    nickName: name,
    league: 'NFL',
    abr,
  };
});

async function seedTeams() {
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
