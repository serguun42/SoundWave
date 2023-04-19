import {
  AddPlaylistInfo,
  RemoveAllTracksFromPlaylist,
  GetFullPlaylist,
  GetPlaylistInfo,
  RemovePlaylist,
  SaveTracksByPlaylist,
  UpdatePlaylistInfo,
} from '../database/methods.js';
import ReadPayload from '../util/read-payload.js';
import UserFromCookieToken from '../util/user-from-cookie-token.js';

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
      /** @param {import('../types/playlist').PlaylistInfo} uploadingPlaylistInfo */ (uploadingPlaylistInfo) => {
        if (!uploadingPlaylistInfo?.uuid) return endWithError(406);

        /** @type {(keyof import('../types/playlist').PlaylistInfo)[]} */
        const updatingKeys = ['title'];
        /** @type {Partial<import('../types/playlist').PlaylistInfo>} */
        const updatingInfo = {};
        updatingKeys.forEach((key) => {
          if (uploadingPlaylistInfo[key]) updatingInfo[key] = uploadingPlaylistInfo[key];
        });

        return UserFromCookieToken(cookies).then((user) => {
          if (!user) return endWithError(401);

          return GetPlaylistInfo(uploadingPlaylistInfo.uuid).then((playlistInfoFromDB) => {
            if (playlistInfoFromDB.owner !== user.username) return endWithError(403);

            return UpdatePlaylistInfo(uploadingPlaylistInfo.uuid, updatingInfo).then(() => {
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

          return GetPlaylistInfo(playlistSavingPositions.uuid).then((playlistInfoFromDB) => {
            if (playlistInfoFromDB.owner !== user.username) return endWithError(403);

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
      /** @param {import('../types/playlist').PlaylistInfo} playlistInfo */ (playlistInfo) => {
        /** @type {(keyof import('../types/playlist').PlaylistInfo)[]} */
        const creatingKeys = ['title'];
        /** @type {Partial<import('../types/playlist').PlaylistInfo>} */
        const creatingInfo = {};
        creatingKeys.forEach((key) => {
          if (playlistInfo[key]) creatingInfo[key] = playlistInfo[key];
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
export const DeletePlaylist = ({ req, cookies, sendCode, sendPayload, endWithError, wrapError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload(req, 'json')
    .then(
      /** @param {import('../types/playlist').PlaylistInfo} deletingPlaylistInfo */ (deletingPlaylistInfo) => {
        if (!deletingPlaylistInfo?.uuid) return endWithError(406);

        return UserFromCookieToken(cookies).then((user) => {
          if (!user) return endWithError(401);

          return GetPlaylistInfo(deletingPlaylistInfo.uuid).then((playlistInfoFromDB) => {
            if (playlistInfoFromDB.owner !== user.username) return endWithError(403);

            return RemoveAllTracksFromPlaylist(deletingPlaylistInfo.uuid)
              .then(() => RemovePlaylist(deletingPlaylistInfo.uuid))
              .then(() => sendPayload(200, { deleted: deletingPlaylistInfo.uuid }));
          });
        });
      }
    )
    .catch(wrapError);
};
