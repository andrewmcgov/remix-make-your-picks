import {db} from './db.server';

export async function getTeamOptions() {
  const teams = await db.team.findMany();

  return teams
    .map((team) => {
      return {
        value: String(team.id),
        label: team.fullName,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}
