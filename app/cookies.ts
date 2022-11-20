import {createCookie} from '@remix-run/node';

export const userCookie = createCookie('picker_id', {
  maxAge: 1000 * 60 * 60 * 24 * 365, // one year
});
