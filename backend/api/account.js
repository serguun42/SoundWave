import { GetUser } from '../database/methods.js';
import { HashPassword } from '../util/hashes.js';
import ReadPayload from '../util/read-payload.js';

/** @type {import('../types/api').APIMethod} */
export const SignIn = ({ req, sendCode, sendPayload, wrapError, sendError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload(req, 'json')
    .then(
      /** @param {{ username: string, password: string }} credentials */ (credentials) => {
        if (!credentials?.username || !credentials?.password) return sendError(406);

        return GetUser(credentials.username).then((userDB) => {
          if (!userDB) return sendError(404);

          return HashPassword(credentials.password, userDB.password_salt).then((hashedPassword) => {
            if (hashedPassword !== userDB.password_hash) return sendError(403);

            sendPayload(200, { ok: true, session_token: 'abracadabra' });
            return Promise.resolve();
          });
        });
      }
    )
    .catch(wrapError);
};

/** @type {import('../types/api').APIMethod} */
export const SignUp = ({ path, queries, sendPayload }) => {
  sendPayload(200, { path, queries });
};
