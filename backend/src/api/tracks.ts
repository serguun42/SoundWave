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
import ProbeAudioFile from '../storage/probe-audio-file.js';
import ReadPayload from '../util/read-payload.js';
import SaveUpload from '../storage/save-upload.js';
import UserFromCookieToken from '../util/user-from-cookie-token.js';
import SendFile from '../storage/send-file.js';
import { APIMethod } from '../types/api.js';
import { Track, UploadingTrack } from '../types/entities.js';

export const OwnedTracks: APIMethod = ({ req, queries, cookies, sendCode, sendPayload, wrapError, endWithError }) => {
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

export const LikedTracks: APIMethod = ({ req, queries, cookies, sendCode, sendPayload, wrapError, endWithError }) => {
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

export const TrackInfo: APIMethod = ({ req, queries, sendCode, sendPayload, wrapError }) => {
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

export const TrackCover: APIMethod = ({ res, req, queries, sendCode, sendPayload, wrapError }) => {
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

export const TrackAudio: APIMethod = ({
  res,
  req,
  cookies,
  queries,
  sendCode,
  sendPayload,
  endWithError,
  wrapError,
}) => {
  if (req.method !== 'GET') {
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

      return SendFile({ res, req }, 'audio', uuid);
    })
    .catch(wrapError);
};

export const TracksByPlaylist: APIMethod = ({ req, queries, sendCode, sendPayload, wrapError }) => {
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

export const UpdateTrackInfo: APIMethod = ({ req, cookies, sendCode, sendPayload, endWithError, wrapError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload<UploadingTrack>(req, 'json')
    .then((updatingTrack) => {
      if (!updatingTrack?.uuid) return endWithError(406);

      const allowedUpdatingKeys: (keyof UploadingTrack)[] = ['title', 'artist_name'];
      if (allowedUpdatingKeys.some((key) => !updatingTrack[key])) return endWithError(406);

      const updatingInfo: Partial<UploadingTrack> = {};
      allowedUpdatingKeys.forEach((key) => {
        if (updatingTrack[key]) updatingInfo[key] = updatingTrack[key];
      });

      return UserFromCookieToken(cookies).then((user) => {
        if (!user) return endWithError(401);

        return GetTrack(updatingTrack.uuid).then((trackFromDB) => {
          if (!trackFromDB) return endWithError(404);
          if (trackFromDB.owner !== user.username) return endWithError(403);

          return UpdateTrack(updatingTrack.uuid, updatingInfo).then(() => {
            sendPayload(200, { updated: updatingInfo });
          });
        });
      });
    })
    .catch(wrapError);
};

export const CreateTrack: APIMethod = ({ req, cookies, sendCode, sendPayload, endWithError, wrapError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload<UploadingTrack>(req, 'json')
    .then((creatingTrack) => {
      const allowedCreatingKeys: (keyof UploadingTrack)[] = ['title', 'artist_name'];
      if (allowedCreatingKeys.some((key) => !creatingTrack[key])) return endWithError(406);

      const creatingInfo: Partial<Track> = {};
      allowedCreatingKeys.forEach((key) => {
        if (creatingTrack[key]) creatingInfo[key] = creatingTrack[key];
      });

      return UserFromCookieToken(cookies).then((user) => {
        if (!user) return endWithError(401);

        creatingInfo.owner = user.username;

        return AddTrack(creatingInfo).then((created) => {
          sendPayload(200, { created });
        });
      });
    })
    .catch(wrapError);
};

export const UploadAudio: APIMethod = ({ req, cookies, queries, sendCode, sendPayload, endWithError, wrapError }) => {
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

          ProbeAudioFile(filename)
            .then(({ duration, mimeType }) => UpdateTrack(uuid, { duration, mime_type: mimeType }))
            .catch(LogMessageOrError);
        });
      });
    })
    .catch(wrapError);
};

export const UploadTrackCover: APIMethod = ({
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

      return GetTrack(uuid).then((track) => {
        if (!track) return endWithError(404);
        if (track.owner !== user.username) return endWithError(403);

        return SaveUpload(req, 'cover', uuid).then(({ received }) => sendPayload(200, { received }));
      });
    })
    .catch(wrapError);
};

export const DeleteTrack: APIMethod = ({ req, cookies, sendCode, sendPayload, endWithError, wrapError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload<UploadingTrack>(req, 'json')
    .then((deletingTrack) => {
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
    })
    .catch(wrapError);
};

export const MarkTrackAsLiked: APIMethod = ({ req, cookies, sendCode, sendPayload, endWithError, wrapError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload<UploadingTrack>(req, 'json')
    .then((likingTrack) => {
      if (!likingTrack?.uuid) return endWithError(406);

      return UserFromCookieToken(cookies).then((user) => {
        if (!user) return endWithError(401);

        return IsTrackLiked(user.username, likingTrack.uuid).then((isLiked) => {
          if (isLiked) return sendPayload(200, { liked: true });

          return LikeTrack(user.username, likingTrack.uuid).then(() => sendPayload(200, { liked: true }));
        });
      });
    })
    .catch(wrapError);
};

export const MarkTrackAsUnliked: APIMethod = ({ req, cookies, sendCode, sendPayload, endWithError, wrapError }) => {
  if (req.method !== 'POST') {
    sendCode(405);
    return;
  }

  ReadPayload<UploadingTrack>(req, 'json')
    .then((unlikingTrack) => {
      if (!unlikingTrack?.uuid) return endWithError(406);

      return UserFromCookieToken(cookies).then((user) => {
        if (!user) return endWithError(401);

        return IsTrackLiked(user.username, unlikingTrack.uuid).then((isLiked) => {
          if (!isLiked) return sendPayload(200, { unliked: true });

          return UnlikeTrack(user.username, unlikingTrack.uuid).then(() => sendPayload(200, { unliked: true }));
        });
      });
    })
    .catch(wrapError);
};
