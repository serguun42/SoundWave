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
} from '../database/methods.js';
import ReadPayload from '../util/read-payload.js';
import SaveUpload from '../util/save-upload.js';
import UserFromCookieToken from '../util/user-from-cookie-token.js';

/** @type {import('../types/api').APIMethod} */
export const OwnedPlaylists = ({ req, queries, cookies, sendCode, sendPayload, wrapError, endWithError }) => {
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

/** @type {import('../types/api').APIMethod} */
export const LikedPlaylists = ({ req, queries, cookies, sendCode, sendPayload, wrapError, endWithError }) => {
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

/** @type {import('../types/api').APIMethod} */
export const PlaylistInfo = ({ req, queries, sendCode, sendPayload, wrapError }) => {
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

/** @type {import('../types/api').APIMethod} */
export const FullPlaylist = ({ req, queries, sendCode, sendPayload, wrapError }) => {
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

/** @type {import('../types/api').APIMethod} */
export const UpdatePlaylist = ({ req, cookies, sendCode, sendPayload, endWithError, wrapError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload(req, 'json')
    .then(
      /** @param {import('../types/playlist').PlaylistInfo} updatingPlaylist */ (updatingPlaylist) => {
        if (!updatingPlaylist?.uuid) return endWithError(406);

        /** @type {(keyof import('../types/playlist').PlaylistInfo)[]} */
        const updatingKeys = ['title'];
        if (updatingKeys.some((key) => !updatingPlaylist[key])) return endWithError(406);

        /** @type {Partial<import('../types/playlist').PlaylistInfo>} */
        const updatingInfo = {};
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
      }
    )
    .catch(wrapError);
};

/** @type {import('../types/api').APIMethod} */
export const UpdateTracksInPlaylist = ({ req, cookies, sendCode, sendPayload, endWithError, wrapError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload(req, 'json')
    .then(
      /** @param {import('../types/playlist').PlaylistSavingPositions} playlistSavingPositions */ (
        playlistSavingPositions
      ) => {
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
      }
    )
    .catch(wrapError);
};

/** @type {import('../types/api').APIMethod} */
export const CreatePlaylist = ({ req, cookies, sendCode, sendPayload, endWithError, wrapError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload(req, 'json')
    .then(
      /** @param {import('../types/playlist').PlaylistInfo} creatingPlaylist */ (creatingPlaylist) => {
        /** @type {(keyof import('../types/playlist').PlaylistInfo)[]} */
        const creatingKeys = ['title'];
        if (creatingKeys.some((key) => !creatingPlaylist[key])) return endWithError(406);

        /** @type {Partial<import('../types/playlist').PlaylistInfo>} */
        const creatingInfo = {};
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
      }
    )
    .catch(wrapError);
};

/** @type {import('../types/api').APIMethod} */
export const UploadPlaylistCover = ({ req, cookies, queries, sendCode, sendPayload, endWithError, wrapError }) => {
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

      return GetPlaylistInfo(uuid).then((playlisy) => {
        if (!playlisy) return endWithError(404);
        if (playlisy.owner !== user.username) return endWithError(403);

        return SaveUpload(req, 'cover', uuid).then(({ received }) => sendPayload(200, { received }));
      });
    })
    .catch(wrapError);
};

/** @type {import('../types/api').APIMethod} */
export const DeletePlaylist = ({ req, cookies, sendCode, sendPayload, endWithError, wrapError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload(req, 'json')
    .then(
      /** @param {import('../types/playlist').PlaylistInfo} deletingPlaylist */ (deletingPlaylist) => {
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
      }
    )
    .catch(wrapError);
};

/** @type {import('../types/api').APIMethod} */
export const MarkPlaylistAsLiked = ({ req, cookies, sendCode, sendPayload, endWithError, wrapError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload(req, 'json')
    .then(
      /** @param {import('../types/playlist').PlaylistInfo} likingPlaylist */ (likingPlaylist) => {
        if (!likingPlaylist?.uuid) return endWithError(406);

        return UserFromCookieToken(cookies).then((user) => {
          if (!user) return endWithError(401);

          return IsPlaylistLiked(user.username, likingPlaylist.uuid).then((isLiked) => {
            if (isLiked) return sendPayload(200, { liked: true });

            return LikePlaylist(user.username, likingPlaylist.uuid).then(() => sendPayload(200, { liked: true }));
          });
        });
      }
    )
    .catch(wrapError);
};

/** @type {import('../types/api').APIMethod} */
export const MarkPlaylistAsUnliked = ({ req, cookies, sendCode, sendPayload, endWithError, wrapError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload(req, 'json')
    .then(
      /** @param {import('../types/playlist').PlaylistInfo} unlikingPlaylist */ (unlikingPlaylist) => {
        if (!unlikingPlaylist?.uuid) return endWithError(406);

        return UserFromCookieToken(cookies).then((user) => {
          if (!user) return endWithError(401);

          return IsPlaylistLiked(user.username, unlikingPlaylist.uuid).then((isLiked) => {
            if (!isLiked) return sendPayload(200, { unliked: true });

            return UnlikePlaylist(user.username, unlikingPlaylist.uuid).then(() => sendPayload(200, { unliked: true }));
          });
        });
      }
    )
    .catch(wrapError);
};
