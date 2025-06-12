import { ActionFunction, redirect } from 'react-router';
import {db} from '~/utilities/db.server';
import {hasGameStarted} from '~/utilities/games';
import {defaultSeason} from '~/utilities/static-data';
import {Errors} from '~/utilities/types';
import {currentUser} from '~/utilities/user.server';

// create a Remix action function to add a new tiebreaker to the database
export async function createOrUpdateTiebreaker(request: Request) {
  const user = await currentUser(request);

  if (!user) {
    return redirect('/');
  }

  const formData = await request.formData();
  let value = formData.get('value') as string;
  const season = (formData.get('season') || defaultSeason) as string;

  const superbowl = await db.game.findFirst({
    where: {
      season: season,
      week: 'SB',
    },
  });

  const errors: Errors = {};

  if (!value || isNaN(Number(value))) {
    errors.message = 'Must provide a number for tiebreaker';
    return {errors};
  }

  if (Number(value) < 1) {
    errors.message = 'Tiebreaker must be positive number';
    return {errors};
  }

  if (!superbowl || hasGameStarted(superbowl)) {
    errors.message = 'Superbowl has already started';
    return {errors};
  }

  const valueAsNumber = Number(value);

  // check for existing tiebreaker for user and season
  const existingTiebreaker = await db.tieBreaker.findFirst({
    where: {
      userId: user.id,
      season: season,
    },
  });

  if (existingTiebreaker) {
    const updatedTieBreaker = await db.tieBreaker.update({
      where: {
        id: existingTiebreaker.id,
      },
      data: {
        value: valueAsNumber,
      },
    });

    if (updatedTieBreaker.id) {
      return redirect('/');
    }

    errors.message = 'Must provide a number for tiebreaker';
    return {errors};
  }

  const newTieBreaker = await db.tieBreaker.create({
    data: {
      value: valueAsNumber,
      season: season,
      userId: user.id,
    },
  });

  if (newTieBreaker.id) {
    return redirect('/');
  }

  errors.message = 'Must provide a number for tiebreaker';
  return {errors};
}
