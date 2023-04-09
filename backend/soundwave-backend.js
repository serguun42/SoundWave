import { FindAllPlaylists, FindAllPlaylistsTracks, FindAllTracks, FindUser } from './database/core.js';
import LogMessageOrError from './util/log.js';

setTimeout(() => {
  FindUser('admin')
    .then((user) => console.log(user.dataValues))
    .catch(LogMessageOrError);

  FindAllTracks()
    .then((tracks) => {
      tracks.forEach((track) => {
        console.log(track.dataValues);
      });
    })
    .catch(LogMessageOrError);

  FindAllPlaylists()
    .then((tracks) => {
      tracks.forEach((track) => {
        console.log(track.dataValues);
      });
    })
    .catch(LogMessageOrError);

  FindAllPlaylistsTracks()
    .then((tracks) => {
      tracks.forEach((track) => {
        console.log(track.dataValues);
      });
    })
    .catch(LogMessageOrError);
}, 1000);
