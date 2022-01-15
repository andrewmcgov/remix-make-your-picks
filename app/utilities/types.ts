import {User, Game, Team, Pick as GamePick} from '@prisma/client';

export type SafeUser = Pick<User, 'username' | 'email' | 'id' | 'isAdmin'>;

export type PickWithTeamAndUsername = GamePick & {
  team: Team;
  user: {
    username: string;
  };
};

export type IndexGame = Game & {
  home: Team;
  homePickUsernames: string[];
  away: Team;
  awayPickUsernames: string[];
  start: string;
  picks: PickWithTeamAndUsername[];
  userPick?: PickWithTeamAndUsername;
};

export type AdminGame = Game & {
  home: Team;
  away: Team;
  start: string;
  picks: Pick<GamePick, 'id'>[];
};

export interface Option {
  value: string;
  label: string;
}
