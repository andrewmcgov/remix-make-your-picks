export async function getGameData(request: Request) {
  const formData = await request.formData();
  const homeId = formData.get('homeId');
  const awayId = formData.get('awayId');
  const date = formData.get('date');
  const time = formData.get('time');
  const week = formData.get('week') as string | null;

  return {homeId, awayId, date, time, week};
}
