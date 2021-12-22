import {ActionFunction, LoaderFunction, redirect} from 'remix';
import {db} from '~/utilities/db.server';
import {hasGameStarted} from '~/utilities/games';
import {currentUser} from '~/utilities/user.server';

interface Errors {
  [key: string]: string;
}

export const loader: LoaderFunction = async () => {
  return redirect('/');
};

export const action: ActionFunction = async ({request}) => {
  const user = await currentUser(request);

  if (!user) {
    return redirect('/');
  }

  console.log('I am running');

  let url = new URL(request.url);
  const gameId = url.searchParams.get('game');
  const teamId = url.searchParams.get('team');

  const errors: Errors = {};

  if (!gameId || !teamId) {
    errors.message = 'Request missing team or game ID.';
    return {errors};
  }

  console.log('game and team exist');

  const game = await db.game.findUnique({where: {id: Number(gameId)}});

  if (!game) {
    errors.message = 'Could not find matching game for this pick';
    return {errors};
  }

  console.log('game found in db');

  if (hasGameStarted(game)) {
    errors.message = 'This game has already started.';
    return {errors};
  }

  console.log('game has not started');

  if (Number(teamId) !== game.homeId && Number(teamId) !== game.awayId) {
    errors.message = 'The team you picked is not playing in this game.';
    return {errors};
  }

  console.log('picked team id is in game');

  const existingPick = await db.pick.findFirst({
    where: {
      userId: user.id,
      gameId: game.id,
    },
  });

  if (existingPick) {
    const updatedPick = await db.pick.update({
      where: {id: existingPick.id},
      data: {
        team: {connect: {id: Number(teamId)}},
      },
    });

    if (updatedPick) {
      return redirect('/');
    }
  } else {
    const newPick = await db.pick.create({
      data: {
        game: {connect: {id: game.id}},
        team: {connect: {id: Number(teamId)}},
        user: {connect: {id: user.id}},
      },
    });
    if (newPick) {
      return redirect('/');
    }
  }

  errors.message = 'There was an errr making your pick.';
  return {errors};
};
