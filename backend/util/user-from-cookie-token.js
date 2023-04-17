import { GetUserBySession } from '../database/methods.js';

/**
 * Checks session by cookies from request, returns Promise with User or null or rejects
 * @param {import('../types/api').APIMethodParams} params
 * @returns {Promise<import('../types/db-models').UserDB | null>}
 */
const UserFromCookieToken = ({ cookies }) => {
  const sessionToken = cookies.session_token;
  if (!sessionToken) return Promise.reject();

  return GetUserBySession(sessionToken).then((user) => {
    if (!user) return Promise.reject();
    return Promise.resolve(user);
  });
};

export default UserFromCookieToken;
