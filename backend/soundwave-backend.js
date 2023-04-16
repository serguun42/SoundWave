/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import {
  FindLikedPlaylists,
  FindLikedTracks,
  FindOwnedTracks,
  GetFullPlaylist,
  GetTracksByPlaylist,
  GetUser,
  LikePlaylist,
  UnlikePlaylist,
} from './database/methods.js';
import LogMessageOrError from './util/log.js';

setTimeout(() => {
  GetUser('admin')
    .then((user) => {
      if (!user) return;

      FindLikedTracks(user.username)
        .then((likedTracks) => {
          console.log('likedTracks:', likedTracks);
        })
        .catch(LogMessageOrError);

      FindLikedPlaylists(user.username)
        .then((likedPlaylists) => {
          console.log('likedPlaylists:', likedPlaylists);

          const playlistUUID = likedPlaylists[0]?.uuid;
          if (!playlistUUID) return;

          GetFullPlaylist(playlistUUID)
            .then((fullPlaylist) => console.log('fullPlaylist:', fullPlaylist))
            .catch(LogMessageOrError);

          GetTracksByPlaylist(playlistUUID)
            .then((tracksInPlaylist) => console.log('tracksInPlaylist:', tracksInPlaylist))
            .catch(LogMessageOrError);

          UnlikePlaylist(user.username, playlistUUID)
            .then(() => {
              console.log(`Playlist unliked`);
              return LikePlaylist(user.username, playlistUUID);
            })
            .then(() => console.log(`Playlist liked again`))
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
