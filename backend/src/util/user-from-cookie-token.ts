import { GetUserBySession } from '../database/methods.js';
import { APIMethodParams } from '../types/api.js';

/**
 * Checks session by cookies from request, returns Promise with User or null
 */
const UserFromCookieToken = (cookies: APIMethodParams['cookies']) => {
  if (typeof cookies !== 'object') return Promise.resolve(null);

  const sessionToken = cookies.session_token;
  if (!sessionToken) return Promise.resolve(null);

  return GetUserBySession(sessionToken).then((user) => Promise.resolve(user));
};

export default UserFromCookieToken;
