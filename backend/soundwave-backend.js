/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import {
  FindLikedPlaylists,
  GetFullPlaylist,
  GetPlaylistInfo,
  GetTrack,
  GetTracksByPlaylist,
  GetUser,
} from './database/methods.js';
import LogMessageOrError from './util/log.js';
import UnwrapModel from './util/unwrap-model.js';

setTimeout(() => {
  GetUser('admin')
    .then((user) => {
      if (!user) return;

      FindLikedPlaylists(UnwrapModel(user).username)
        .then((likedPlaylists) => {
          const playlistUUID = UnwrapModel(likedPlaylists)[0]?.playlist_uuid;

          GetFullPlaylist(playlistUUID)
            .then((fullPlaylist) => console.log('fullPlaylist:', JSON.stringify(fullPlaylist, false, 2)))
            .catch(LogMessageOrError);

          GetTracksByPlaylist(playlistUUID)
            .then((tracksInPlaylist) => console.log('tracksInPlaylist:', JSON.stringify(tracksInPlaylist, false, 2)))
            .catch(LogMessageOrError);
        })
        .catch(LogMessageOrError);
    })
    .catch(LogMessageOrError);

  // /** @type {import('./types/db-models').UserDB} */
  // const newUser = {
  //   username: 'second_user',
  //   password_salt: CreateSalt(),
  // };
  // HashPassword('password', newUser.password_salt)
  //   .then((passwordHash) => InsertUser({ ...newUser, password_hash: passwordHash }))
  //   .then((createdUser) => console.log('Created user:', UnwrapModel(createdUser)))
  //   .catch(LogMessageOrError);
}, 1000);
