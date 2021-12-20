import {User, Game, Team, Pick as GamePick} from '@prisma/client';

export type SafeUser = Pick<User, 'username' | 'email' | 'id'>;

export type IndexGame = Game & {
  home: Team;
  away: Team;
  picks: (GamePick & {
    team: Team;
    user: {
      username: string;
    };
  })[];
};

export type AdminGame = Game & {
  home: Team;
  away: Team;
  picks: Pick<GamePick, 'id'>[];
};
