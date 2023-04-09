import {
  FindLikedPlaylists,
  FindLikedTracks,
  FindOwnedPlaylists,
  FindOwnedTracks,
  GetUser,
  InsertUser,
} from './database/core.js';
import { CreateSalt, HashPassword } from './util/hashes.js';
import LogMessageOrError from './util/log.js';
import UnwrapModel from './util/unwrap-model.js';

setTimeout(() => {
  GetUser('admin')
    .then((user) => {
      if (!user) return;

      console.log('user:', UnwrapModel(user));

      FindOwnedTracks(UnwrapModel(user).username)
        .then((ownedTracks) => console.log('Owned tracks:', UnwrapModel(ownedTracks)))
        .catch(LogMessageOrError);

      FindOwnedPlaylists(UnwrapModel(user).username)
        .then((ownedPlaylists) => console.log('Owned playlists:', UnwrapModel(ownedPlaylists)))
        .catch(LogMessageOrError);

      FindLikedTracks(UnwrapModel(user).username)
        .then((likedTracks) => console.log('Liked tracks:', UnwrapModel(likedTracks)))
        .catch(LogMessageOrError);

      FindLikedPlaylists(UnwrapModel(user).username)
        .then((likedPlaylists) => console.log('Liked playlists:', UnwrapModel(likedPlaylists)))
        .catch(LogMessageOrError);
    })
    .catch(LogMessageOrError);

  /** @type {import('./types/db-models').UserDB} */
  const newUser = {
    username: 'second_user',
    password_salt: CreateSalt(),
  };
  HashPassword('password', newUser.password_salt)
    .then((passwordHash) => InsertUser({ ...newUser, password_hash: passwordHash }))
    .then((createdUser) => console.log('Created user:', UnwrapModel(createdUser)))
    .catch(LogMessageOrError);
}, 1000);
