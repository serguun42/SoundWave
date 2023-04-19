import {
  AddTrack,
  FindLikedTracks,
  FindOwnedTracks,
  GetTrack,
  GetTracksByPlaylist,
  IsTrackLiked,
  LikeTrack,
  RemoveTrack,
  RemoveTrackFromAllPlaylists,
  UnlikeTrack,
  UnlikeTrackForEveryone,
  UpdateTrack,
} from '../database/methods.js';
import LogMessageOrError from '../util/log.js';
import PullDurationFromFile from '../util/pull-duration-from-file.js';
import ReadPayload from '../util/read-payload.js';
import SaveUpload from '../util/save-upload.js';
import UserFromCookieToken from '../util/user-from-cookie-token.js';

/** @type {import('../types/api').APIMethod} */
export const OwnedTracks = ({ req, queries, cookies, sendCode, sendPayload, wrapError, endWithError }) => {
  if (req.method !== 'GET') {
    sendCode(405);
    return;
  }

  const offset = Math.max(parseInt(queries.offset), 0) || 0;
  const limit = Math.max(Math.min(parseInt(queries.limit), 100), 0) || 100;

  UserFromCookieToken(cookies)
    .then((user) => {
      if (!user) return endWithError(401);

      return FindOwnedTracks(user.username, offset, limit).then((tracks) => sendPayload(200, tracks));
    })
    .catch(wrapError);
};

/** @type {import('../types/api').APIMethod} */
export const LikedTracks = ({ req, queries, cookies, sendCode, sendPayload, wrapError, endWithError }) => {
  if (req.method !== 'GET') {
    sendCode(405);
    return;
  }

  const offset = Math.max(parseInt(queries.offset), 0) || 0;
  const limit = Math.max(Math.min(parseInt(queries.limit), 100), 0) || 100;

  UserFromCookieToken(cookies)
    .then((user) => {
      if (!user) return endWithError(401);

      return FindLikedTracks(user.username, offset, limit).then((tracks) => sendPayload(200, tracks));
    })
    .catch(wrapError);
};

/** @type {import('../types/api').APIMethod} */
export const TrackInfo = ({ req, queries, sendCode, sendPayload, wrapError }) => {
  if (req.method !== 'GET') {
    sendCode(405);
    return;
  }

  const { uuid } = queries;
  if (!uuid || typeof uuid !== 'string') {
    sendPayload(406, 'No uuid query');
    return;
  }

  GetTrack(uuid)
    .then((track) => {
      if (!track) sendPayload(404, { error: 'Not found' });
      else sendPayload(200, track);
    })
    .catch(wrapError);
};

/** @type {import('../types/api').APIMethod} */
export const TracksByPlaylist = ({ req, queries, sendCode, sendPayload, wrapError }) => {
  if (req.method !== 'GET') {
    sendCode(405);
    return;
  }

  const { uuid } = queries;
  if (!uuid || typeof uuid !== 'string') {
    sendPayload(406, 'No uuid query');
    return;
  }

  GetTracksByPlaylist(uuid)
    .then((tracks) => {
      if (!tracks) sendPayload(404, []);
      else sendPayload(200, tracks);
    })
    .catch(wrapError);
};

/** @type {import('../types/api').APIMethod} */
export const CreateTrack = ({ req, cookies, sendCode, sendPayload, endWithError, wrapError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload(req, 'json')
    .then(
      /** @param {import('../types/track').Track} creatingTrack */ (creatingTrack) => {
        /** @type {(keyof import('../types/track').Track)[]} */
        const creatingKeys = ['title', 'artist_name'];
        if (creatingKeys.some((key) => !creatingTrack[key])) return endWithError(406);

        /** @type {Partial<import('../types/track').Track>} */
        const creatingInfo = {};
        creatingKeys.forEach((key) => {
          if (creatingTrack[key]) creatingInfo[key] = creatingTrack[key];
        });

        return UserFromCookieToken(cookies).then((user) => {
          if (!user) return endWithError(401);

          creatingInfo.owner = user.username;

          return AddTrack(creatingInfo).then((created) => {
            sendPayload(200, { created });
          });
        });
      }
    )
    .catch(wrapError);
};

/** @type {import('../types/api').APIMethod} */
export const UploadAudio = ({ req, cookies, queries, sendCode, sendPayload, endWithError, wrapError }) => {
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

      return GetTrack(uuid).then((track) => {
        if (!track) return endWithError(404);
        if (track.owner !== user.username) return endWithError(403);

        return SaveUpload(req, 'audio', uuid).then(({ received, filename }) => {
          sendPayload(200, { received });

          PullDurationFromFile(filename)
            .then((duration) => UpdateTrack(uuid, { duration }))
            .catch(LogMessageOrError);
        });
      });
    })
    .catch(wrapError);
};

/** @type {import('../types/api').APIMethod} */
export const UploadTrackCover = ({ req, cookies, queries, sendCode, sendPayload, endWithError, wrapError }) => {
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

      return GetTrack(uuid).then((track) => {
        if (!track) return endWithError(404);
        if (track.owner !== user.username) return endWithError(403);

        return SaveUpload(req, 'cover', uuid).then(({ received }) => sendPayload(200, { received }));
      });
    })
    .catch(wrapError);
};

/** @type {import('../types/api').APIMethod} */
export const DeleteTrack = ({ req, cookies, sendCode, sendPayload, endWithError, wrapError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload(req, 'json')
    .then(
      /** @param {import('../types/track').Track} deletingTrack */ (deletingTrack) => {
        if (!deletingTrack?.uuid) return endWithError(406);

        return UserFromCookieToken(cookies).then((user) => {
          if (!user) return endWithError(401);

          return GetTrack(deletingTrack.uuid).then((trackFromDB) => {
            if (!trackFromDB) return endWithError(404);
            if (trackFromDB.owner !== user.username) return endWithError(403);

            return RemoveTrackFromAllPlaylists(deletingTrack.uuid)
              .then(() => UnlikeTrackForEveryone(deletingTrack.uuid))
              .then(() => RemoveTrack(deletingTrack.uuid))
              .then(() => sendPayload(200, { deleted: deletingTrack.uuid }));
          });
        });
      }
    )
    .catch(wrapError);
};

/** @type {import('../types/api').APIMethod} */
export const MarkTrackAsLiked = ({ req, cookies, sendCode, sendPayload, endWithError, wrapError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload(req, 'json')
    .then(
      /** @param {import('../types/track').Track} likingTrack */ (likingTrack) => {
        if (!likingTrack?.uuid) return endWithError(406);

        return UserFromCookieToken(cookies).then((user) => {
          if (!user) return endWithError(401);

          return IsTrackLiked(user.username, likingTrack.uuid).then((isLiked) => {
            if (isLiked) return sendPayload(200, { liked: true });

            return LikeTrack(user.username, likingTrack.uuid).then(() => sendPayload(200, { liked: true }));
          });
        });
      }
    )
    .catch(wrapError);
};

/** @type {import('../types/api').APIMethod} */
export const MarkTrackAsUnliked = ({ req, cookies, sendCode, sendPayload, endWithError, wrapError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload(req, 'json')
    .then(
      /** @param {import('../types/track').Track} unlikingTrack */ (unlikingTrack) => {
        if (!unlikingTrack?.uuid) return endWithError(406);

        return UserFromCookieToken(cookies).then((user) => {
          if (!user) return endWithError(401);

          return IsTrackLiked(user.username, unlikingTrack.uuid).then((isLiked) => {
            if (!isLiked) return sendPayload(200, { unliked: true });

            return UnlikeTrack(user.username, unlikingTrack.uuid).then(() => sendPayload(200, { unliked: true }));
          });
        });
      }
    )
    .catch(wrapError);
};
