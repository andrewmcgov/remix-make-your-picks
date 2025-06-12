import {ActionFunction} from 'react-router';
import {logOut} from '../utilities/user.server';

export const action: ActionFunction = async ({request}) => {
  return await logOut(request);
};
