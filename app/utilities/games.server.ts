import {defaultWeek, defaultSeason} from './static-data';

export async function getGameData(request: Request) {
  const formData = await request.formData();
  const homeId = formData.get('homeId');
  const awayId = formData.get('awayId');
  const startString = formData.get('start') as string | null;
  const week = formData.get('week') as string | null;
  const season = formData.get('season') as string | null;

  return {homeId, awayId, startString, week, season};
}

export function gameFilters(request: Request) {
  const url = new URL(request.url);
  const week = url.searchParams.get('week') || defaultWeek;
  const season = url.searchParams.get('season') || defaultSeason;
  return {week, season};
}
