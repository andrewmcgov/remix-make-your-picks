import {Game} from '@prisma/client';
import {IndexGame} from './types';

export function hasGameStarted(game: Game | IndexGame) {
  const start = game.start as string;
  return Date.parse(start) < Date.now();
}

export function isGameClosed(gmae: Game | IndexGame) {
  return gmae.awayScore !== null && gmae.homeScore !== null;
}
