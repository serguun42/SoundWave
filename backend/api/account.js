import { AddSession, AddUser, DeleteSession, GetUser } from '../database/methods.js';
import UserFromCookieToken from '../util/user-from-cookie-token.js';
import { CreateSalt, CreateSessionToken, HashPassword } from '../util/hashes.js';
import ReadPayload from '../util/read-payload.js';
import LoadConfig from '../util/load-configs.js';

/** @type {import('../types/api').APIMethod} */
export const CheckSession = ({ req, cookies, sendCode, sendPayload }) => {
  if (req.method !== 'GET') {
    sendCode(405);
    return;
  }

  UserFromCookieToken(cookies)
    .then((user) => {
      if (!user) return Promise.reject();
      sendPayload(200, { ok: true, username: user.username, is_admin: user.is_admin });
      return Promise.resolve();
    })
    .catch(() => sendPayload(403, { ok: false }));
};

/** @type {import('../types/api').APIMethod} */
export const SignIn = ({ req, res, sendCode, sendPayload, wrapError, endWithError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload(req, 'json')
    .then(
      /** @param {{ username: string, password: string }} credentials */ (credentials) => {
        if (!credentials?.username || !credentials?.password) return endWithError(406);

        return GetUser(credentials.username).then((userDB) => {
          if (!userDB) return endWithError(404);

          return HashPassword(credentials.password, userDB.password_salt).then((hashedPassword) => {
            if (hashedPassword !== userDB.password_hash) return endWithError(403);

            return CreateSessionToken(credentials.username).then((sessionToken) => {
              /** 3 months-valid */
              const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 3);
              return AddSession({
                session_token: sessionToken,
                owner: credentials.username,
                until: expirationDate,
              }).then(() => {
                res.setHeader(
                  'Set-Cookie',
                  `session_token=${sessionToken}; Expires=${expirationDate.toUTCString()}; Path=/; Domain=${
                    LoadConfig('api').domain
                  }; Secure`
                );
                sendPayload(200, { session_token: sessionToken });
              });
            });
          });
        });
      }
    )
    .catch(wrapError);
};

/** @type {import('../types/api').APIMethod} */
export const SignUp = ({ req, res, sendCode, sendPayload, wrapError, endWithError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload(req, 'json')
    .then(
      /** @param {{ username: string, password: string }} credentials */ (credentials) => {
        if (!credentials?.username || !credentials?.password) return endWithError(406);
        if (typeof credentials.username !== 'string' || typeof credentials.password !== 'string')
          return endWithError(406);

        if (credentials.username.length < 6) return endWithError(422, 'Too short username');
        if (credentials.password.length < 14) return endWithError(417, 'Too short password');

        return GetUser(credentials.username).then((userDB) => {
          if (userDB) return endWithError(409);

          const passwordSalt = CreateSalt();
          return HashPassword(credentials.password, passwordSalt)
            .then((hashedPassword) =>
              AddUser({
                username: credentials.username,
                password_hash: hashedPassword,
                password_salt: passwordSalt,
                is_admin: false,
              })
            )
            .then(() =>
              CreateSessionToken(credentials.username).then((sessionToken) => {
                /** 3 months-valid */
                const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 3);
                return AddSession({
                  session_token: sessionToken,
                  owner: credentials.username,
                  until: expirationDate,
                }).then(() => {
                  res.setHeader(
                    'Set-Cookie',
                    `session_token=${sessionToken}; Expires=${expirationDate.toUTCString()}; Path=/; Domain=${
                      LoadConfig('api').domain
                    }; Secure`
                  );
                  sendPayload(200, { session_token: sessionToken });
                });
              })
            );
        });
      }
    )
    .catch(wrapError);
};

/** @type {import('../types/api').APIMethod} */
export const Logout = ({ req, res, cookies, sendCode, sendPayload }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  UserFromCookieToken(cookies)
    .then((user) => {
      if (!user) return Promise.reject();

      return DeleteSession(cookies.session_token).then(() => {
        res.setHeader(
          'Set-Cookie',
          `session_token=null; Expires=${new Date(0).toUTCString()}; Path=/; Domain=${LoadConfig('api').domain}; Secure`
        );
        sendPayload(200, { ok: true });
      });
    })
    .catch(() => sendPayload(403, { ok: false }));
};
