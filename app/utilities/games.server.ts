export async function getGameData(request: Request) {
  const formData = await request.formData();
  const homeId = formData.get('homeId');
  const awayId = formData.get('awayId');
  const startString = formData.get('start') as string | null;
  const week = formData.get('week') as string | null;

  return {homeId, awayId, startString, week};
}
