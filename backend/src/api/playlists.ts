import { randomUUID } from 'node:crypto';
import {
  AddPlaylistInfo,
  RemoveAllTracksFromPlaylist,
  GetFullPlaylist,
  GetPlaylistInfo,
  RemovePlaylist,
  SaveTracksByPlaylist,
  UpdatePlaylistInfo,
  UnlikePlaylistForEveryone,
  FindOwnedPlaylists,
  FindLikedPlaylists,
  LikePlaylist,
  UnlikePlaylist,
  IsPlaylistLiked,
  GetRandomTracks,
} from '../database/methods.js';
import ReadPayload from '../util/read-payload.js';
import SaveUpload from '../storage/save-upload.js';
import UserFromCookieToken from '../util/user-from-cookie-token.js';
import SendFile from '../storage/send-file.js';
import { APIMethod } from '../types/api.js';
import { Playlist, PlaylistSavingPositions, UploadingPlaylist } from '../types/entities.js';

export const OwnedPlaylists: APIMethod = ({
  req,
  queries,
  cookies,
  sendCode,
  sendPayload,
  wrapError,
  endWithError,
}) => {
  if (req.method !== 'GET') {
    sendCode(405);
    return;
  }

  const offset = Math.max(parseInt(queries.offset), 0) || 0;
  const limit = Math.max(Math.min(parseInt(queries.limit), 100), 0) || 100;

  UserFromCookieToken(cookies)
    .then((user) => {
      if (!user) return endWithError(401);

      return FindOwnedPlaylists(user.username, offset, limit).then((playlists) => sendPayload(200, playlists));
    })
    .catch(wrapError);
};

export const LikedPlaylists: APIMethod = ({
  req,
  queries,
  cookies,
  sendCode,
  sendPayload,
  wrapError,
  endWithError,
}) => {
  if (req.method !== 'GET') {
    sendCode(405);
    return;
  }

  const offset = Math.max(parseInt(queries.offset), 0) || 0;
  const limit = Math.max(Math.min(parseInt(queries.limit), 100), 0) || 100;

  UserFromCookieToken(cookies)
    .then((user) => {
      if (!user) return endWithError(401);

      return FindLikedPlaylists(user.username, offset, limit).then((playlists) => sendPayload(200, playlists));
    })
    .catch(wrapError);
};

export const PlaylistInfo: APIMethod = ({ req, queries, sendCode, sendPayload, wrapError }) => {
  if (req.method !== 'GET') {
    sendCode(405);
    return;
  }

  const { uuid } = queries;
  if (!uuid || typeof uuid !== 'string') {
    sendPayload(406, 'No uuid query');
    return;
  }

  GetPlaylistInfo(uuid)
    .then((playlist) => {
      if (!playlist) sendPayload(404, { error: 'Not found' });
      else sendPayload(200, playlist);
    })
    .catch(wrapError);
};

export const PlaylistCover: APIMethod = ({ res, req, queries, sendCode, sendPayload, wrapError }) => {
  if (req.method !== 'GET') {
    sendCode(405);
    return;
  }

  const { uuid } = queries;
  if (!uuid || typeof uuid !== 'string') {
    sendPayload(406, 'No uuid query');
    return;
  }

  SendFile({ res, req }, 'cover', uuid).catch(wrapError);
};

export const PlaylistFull: APIMethod = ({ req, queries, sendCode, sendPayload, wrapError }) => {
  if (req.method !== 'GET') {
    sendCode(405);
    return;
  }

  const { uuid } = queries;
  if (!uuid || typeof uuid !== 'string') {
    sendPayload(406, 'No uuid query');
    return;
  }

  GetFullPlaylist(uuid)
    .then((playlistFull) => {
      if (!playlistFull) sendPayload(404, { error: 'Not found' });
      else sendPayload(200, playlistFull);
    })
    .catch(wrapError);
};

export const GeneratePlaylist: APIMethod = ({ req, queries, sendCode, sendPayload, wrapError }) => {
  if (req.method !== 'GET') {
    sendCode(405);
    return;
  }

  const limit = Math.max(Math.min(parseInt(queries.limit), 20), 0) || 10;

  GetRandomTracks(limit)
    .then((randomTracks) => {
      if (!randomTracks) {
        sendPayload(404, { error: 'Not found' });
        return;
      }

      const generatedPlaylist: import('../types/entities.js').PlaylistFull = {
        uuid: randomUUID(),
        owner: 'You',
        title: 'Generated playlist',
        sum_duration: randomTracks.reduce((accum, track) => accum + track.duration || 0, 0),
        tracks_in_playlist: randomTracks,
      };

      sendPayload(200, generatedPlaylist);
    })
    .catch(wrapError);
};

export const UpdatePlaylist: APIMethod = ({ req, cookies, sendCode, sendPayload, endWithError, wrapError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload<UploadingPlaylist>(req, 'json')
    .then((updatingPlaylist) => {
      if (!updatingPlaylist?.uuid) return endWithError(406);

      const updatingKeys: (keyof UploadingPlaylist)[] = ['title'];
      if (updatingKeys.some((key) => !updatingPlaylist[key])) return endWithError(406);

      const updatingInfo: Partial<UploadingPlaylist> = {};
      updatingKeys.forEach((key) => {
        if (updatingPlaylist[key]) updatingInfo[key] = updatingPlaylist[key];
      });

      return UserFromCookieToken(cookies).then((user) => {
        if (!user) return endWithError(401);

        return GetPlaylistInfo(updatingPlaylist.uuid).then((playlistFromDB) => {
          if (!playlistFromDB) return endWithError(404);
          if (playlistFromDB.owner !== user.username) return endWithError(403);

          return UpdatePlaylistInfo(updatingPlaylist.uuid, updatingInfo).then(() => {
            sendPayload(200, { updated: updatingInfo });
          });
        });
      });
    })
    .catch(wrapError);
};

export const UpdateTracksInPlaylist: APIMethod = ({ req, cookies, sendCode, sendPayload, endWithError, wrapError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload<PlaylistSavingPositions>(req, 'json')
    .then((playlistSavingPositions) => {
      if (!playlistSavingPositions?.uuid) return endWithError(406);
      if (!Array.isArray(playlistSavingPositions?.positions)) return endWithError(406);
      if (!playlistSavingPositions.positions.every((position) => !!position && typeof position === 'string'))
        return endWithError(406);

      playlistSavingPositions.positions = playlistSavingPositions.positions.filter(
        (position, index, array) => index === array.indexOf(position)
      );

      return UserFromCookieToken(cookies).then((user) => {
        if (!user) return endWithError(401);

        return GetPlaylistInfo(playlistSavingPositions.uuid).then((playlistFromDB) => {
          if (!playlistFromDB) return endWithError(404);
          if (playlistFromDB.owner !== user.username) return endWithError(403);

          return SaveTracksByPlaylist(playlistSavingPositions).then(() => {
            sendPayload(200, { updated: playlistSavingPositions });
          });
        });
      });
    })
    .catch(wrapError);
};

export const CreatePlaylist: APIMethod = ({ req, cookies, sendCode, sendPayload, endWithError, wrapError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload<UploadingPlaylist>(req, 'json')
    .then((creatingPlaylist) => {
      const creatingKeys: (keyof UploadingPlaylist)[] = ['title'];
      if (creatingKeys.some((key) => !creatingPlaylist[key])) return endWithError(406);

      const creatingInfo: Partial<Playlist> = {};
      creatingKeys.forEach((key) => {
        if (creatingPlaylist[key]) creatingInfo[key] = creatingPlaylist[key];
      });

      return UserFromCookieToken(cookies).then((user) => {
        if (!user) return endWithError(401);

        creatingInfo.owner = user.username;

        return AddPlaylistInfo(creatingInfo).then((created) => {
          sendPayload(200, { created });
        });
      });
    })
    .catch(wrapError);
};

export const UploadPlaylistCover: APIMethod = ({
  req,
  cookies,
  queries,
  sendCode,
  sendPayload,
  endWithError,
  wrapError,
}) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  const { uuid } = queries;
  if (!uuid || typeof uuid !== 'string') {
    sendPayload(406, 'No uuid query');
    return;
  }

  UserFromCookieToken(cookies)
    .then((user) => {
      if (!user) return endWithError(401);

      return GetPlaylistInfo(uuid).then((playlist) => {
        if (!playlist) return endWithError(404);
        if (playlist.owner !== user.username) return endWithError(403);

        return SaveUpload(req, 'cover', uuid).then(({ received }) => sendPayload(200, { received }));
      });
    })
    .catch(wrapError);
};

export const DeletePlaylist: APIMethod = ({ req, cookies, sendCode, sendPayload, endWithError, wrapError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload<UploadingPlaylist>(req, 'json')
    .then((deletingPlaylist) => {
      if (!deletingPlaylist?.uuid) return endWithError(406);

      return UserFromCookieToken(cookies).then((user) => {
        if (!user) return endWithError(401);

        return GetPlaylistInfo(deletingPlaylist.uuid).then((playlistFromDB) => {
          if (!playlistFromDB) return endWithError(404);
          if (playlistFromDB.owner !== user.username) return endWithError(403);

          return RemoveAllTracksFromPlaylist(deletingPlaylist.uuid)
            .then(() => UnlikePlaylistForEveryone(deletingPlaylist.uuid))
            .then(() => RemovePlaylist(deletingPlaylist.uuid))
            .then(() => sendPayload(200, { deleted: deletingPlaylist.uuid }));
        });
      });
    })
    .catch(wrapError);
};

export const MarkPlaylistAsLiked: APIMethod = ({ req, cookies, sendCode, sendPayload, endWithError, wrapError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload<UploadingPlaylist>(req, 'json')
    .then((likingPlaylist) => {
      if (!likingPlaylist?.uuid) return endWithError(406);

      return UserFromCookieToken(cookies).then((user) => {
        if (!user) return endWithError(401);

        return IsPlaylistLiked(user.username, likingPlaylist.uuid).then((isLiked) => {
          if (isLiked) return sendPayload(200, { liked: true });

          return LikePlaylist(user.username, likingPlaylist.uuid).then(() => sendPayload(200, { liked: true }));
        });
      });
    })
    .catch(wrapError);
};

export const MarkPlaylistAsUnliked: APIMethod = ({ req, cookies, sendCode, sendPayload, endWithError, wrapError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload<UploadingPlaylist>(req, 'json')
    .then((unlikingPlaylist) => {
      if (!unlikingPlaylist?.uuid) return endWithError(406);

      return UserFromCookieToken(cookies).then((user) => {
        if (!user) return endWithError(401);

        return IsPlaylistLiked(user.username, unlikingPlaylist.uuid).then((isLiked) => {
          if (!isLiked) return sendPayload(200, { unliked: true });

          return UnlikePlaylist(user.username, unlikingPlaylist.uuid).then(() => sendPayload(200, { unliked: true }));
        });
      });
    })
    .catch(wrapError);
};
