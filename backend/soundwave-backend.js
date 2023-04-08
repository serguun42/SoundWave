import { FindAllUsers } from './database/core.js';
import LogMessageOrError from './util/log.js';

setTimeout(() => {
  FindAllUsers()
    .then((users) => {
      users.forEach((user) =>
        console.log(
          `User:
          username: ${user.username},
          password_hash: ${user.password_hash},
          password_salt: ${user.password_salt},
          is_admin: ${user.is_admin}`
        )
      );
    })
    .catch(LogMessageOrError);
}, 1000);
