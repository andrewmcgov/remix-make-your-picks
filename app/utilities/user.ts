import {SafeUser} from './types';

export function isAdmin(user: SafeUser) {
  return user.isAdmin;
}
