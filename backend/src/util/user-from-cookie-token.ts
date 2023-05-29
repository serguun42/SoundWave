import { GetUserBySession } from '../database/methods.js';

/**
 * Checks session by cookies from request, returns Promise with User or null
 * @param {import('../types/api').APIMethodParams['cookies']} cookies
 * @returns {Promise<import('../types/db-models').UserDB | null>}
 */
const UserFromCookieToken = (cookies) => {
  if (typeof cookies !== 'object') return Promise.resolve(null);

  const sessionToken = cookies.session_token;
  if (!sessionToken) return Promise.resolve(null);

  return GetUserBySession(sessionToken).then((user) => Promise.resolve(user || null));
};

export default UserFromCookieToken;
