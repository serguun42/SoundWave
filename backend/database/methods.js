import LogMessageOrError from '../util/log.js';
import UnwrapModel from '../util/unwrap-model.js';
import sequelize from './authenticate.js';
import MODELS from './models.js';

/**
 * @param {string} username
 * @returns {Promise<import('../types/db-models').UserDB>}
 */
export const GetUser = (username) => MODELS.UserDB.findOne({ where: { username } }).then(UnwrapModel);

/**
 * @param {import('../types/db-models').UserDB} user
 * @returns {Promise<import('../types/db-models').UserDB>}
 */
export const AddUser = (user) => MODELS.UserDB.create(user).then(UnwrapModel);

/**
 * @param {string} username
 * @param {Partial<import('../types/db-models').UserDB>} userData
 * @returns {Promise}
 */
export const UpdateUser = (username, userData) => MODELS.UserDB.update(userData, { where: { username } });

/**
 * @param {string} sessionToken
 * @returns {Promise<import('../types/db-models').UserDB>}
 */
export const GetSession = (sessionToken) =>
  MODELS.SessionDB.findOne({ where: { session_token: sessionToken } }).then(UnwrapModel);
/**
 * @param {string} sessionToken
 * @returns {Promise<import('../types/db-models').UserDB>}
 */
export const GetUserBySession = (sessionToken) =>
  MODELS.SessionDB.findOne({
    where: { session_token: sessionToken },
    include: [
      {
        model: MODELS.UserDB,
        as: 'session_to_user',
      },
    ],
  }).then((sessionWithUser) => {
    if (!sessionWithUser) return Promise.resolve(null);

    return UnwrapModel(sessionWithUser.session_to_user);
  });

/**
 * @param {import('../types/db-models').SessionDB} session
 * @returns {Promise<import('../types/db-models').SessionDB>}
 */
export const AddSession = (session) => MODELS.SessionDB.create(session).then(UnwrapModel);

/**
 * @param {string} sessionToken
 * @returns {Promise}
 */
export const DeleteSession = (sessionToken) => MODELS.SessionDB.destroy({ where: { session_token: sessionToken } });

/**
 * @param {string} uuid
 * @returns {Promise<import('../types/track').Track>}
 */
export const GetTrack = (uuid) => MODELS.TrackDB.findOne({ where: { uuid } }).then(UnwrapModel);

/**
 * @param {import('../types/track').Track} track
 * @returns {Promise<import('../types/track').Track>}
 */
export const AddTrack = (track) => MODELS.TrackDB.create(track).then(UnwrapModel);

/**
 * @param {string} trackUUID
 * @param {Partial<import('../types/track').Track>} trackData
 * @returns {Promise}
 */
export const UpdateTrack = (trackUUID, trackData) => MODELS.TrackDB.update(trackData, { where: { uuid: trackUUID } });

/**
 * @param {string} trackUUID
 * @returns {Promise}
 */
export const RemoveTrack = (trackUUID) => MODELS.TrackDB.destroy({ where: { uuid: trackUUID } });

/**
 * @param {string} owner
 * @param {number} [offset]
 * @param {number} [limit]
 * @returns {Promise<import('../types/track').Track[]>}
 */
export const FindOwnedTracks = (owner, offset = 0, limit = 100) =>
  MODELS.TrackDB.findAll({ where: { owner }, limit, offset }).then(UnwrapModel);

/**
 * @param {string} uuid
 * @returns {Promise<import('../types/playlist').PlaylistInfo>}
 */
export const GetPlaylistInfo = (uuid) => MODELS.PlaylistDB.findOne({ where: { uuid } }).then(UnwrapModel);

/**
 * @param {import('../types/playlist').PlaylistInfo} playlistInfo
 * @returns {Promise<import('../types/playlist').PlaylistInfo>}
 */
export const AddPlaylistInfo = (playlistInfo) => MODELS.PlaylistDB.create(playlistInfo).then(UnwrapModel);

/**
 * @param {string} playlistUUID
 * @param {Partial<import('../types/playlist').PlaylistInfo>} playlistInfo
 * @returns {Promise}
 */
export const UpdatePlaylistInfo = (playlistUUID, playlistInfo) =>
  MODELS.PlaylistDB.update(playlistInfo, { where: { uuid: playlistUUID } });

/**
 * @param {string} playlistUUID
 * @returns {Promise}
 */
export const RemovePlaylist = (playlistUUID) => MODELS.PlaylistDB.destroy({ where: { uuid: playlistUUID } });

/**
 * @param {string} playlistUUID
 * @returns {Promise<import('../types/playlist').PlaylistFull>}
 */
export const GetFullPlaylist = (playlistUUID) =>
  MODELS.PlaylistDB.findOne({
    where: { uuid: playlistUUID },
    include: [
      {
        model: MODELS.TrackDB,
        as: 'tracks_in_playlist',
      },
    ],
    order: [
      [{ model: MODELS.TrackDB, as: 'tracks_in_playlist' }, { model: MODELS.PlaylistTrackDB }, 'position', 'ASC'],
    ],
  }).then(
    /** @returns {Promise<import('../types/playlist').PlaylistFull>} */ (fullPlaylist) =>
      Promise.resolve({
        ...UnwrapModel(fullPlaylist),
        tracks_in_playlist: UnwrapModel(fullPlaylist.tracks_in_playlist).map((trackInPlaylist) => {
          trackInPlaylist.position = trackInPlaylist.playlists_tracks?.position || 0;
          delete trackInPlaylist.playlists_tracks;
          return trackInPlaylist;
        }),
      })
  );

/**
 * @param {string} playlistUUID
 * @returns {Promise<import('../types/track').TrackInPlaylist[]>}
 */
export const GetTracksByPlaylist = (playlistUUID) =>
  MODELS.PlaylistTrackDB.findAll({
    where: { playlist_uuid: playlistUUID },
    include: {
      model: MODELS.TrackDB,
      as: 'tracks_by_playlist',
    },
    order: [['position', 'ASC']],
  }).then((tracksByPlaylist) =>
    UnwrapModel(tracksByPlaylist).map((trackByPlaylist) => ({
      ...UnwrapModel(trackByPlaylist.tracks_by_playlist),
      position: trackByPlaylist.position,
    }))
  );

/**
 * @param {import('../types/playlist').PlaylistSavingPositions} savingPositions
 * @returns {Promise}
 */
export const SaveTracksByPlaylist = (savingPositions) =>
  sequelize.transaction().then((transaction) => {
    try {
      return MODELS.PlaylistTrackDB.destroy({ where: { playlist_uuid: savingPositions.uuid } }, { transaction })
        .then(() =>
          MODELS.PlaylistTrackDB.bulkCreate(
            savingPositions.positions.map((trackUUID, position) => ({
              playlist_uuid: savingPositions.uuid,
              track_uuid: trackUUID,
              position,
            })),
            { transaction }
          )
        )
        .then(() => transaction.commit());
    } catch (e) {
      LogMessageOrError('SaveTracksByPlaylist transaction rollback:', e);
      return transaction.rollback().then(() => Promise.reject(e));
    }
  });

/**
 * @param {string} playlistUUID
 */
export const RemoveAllTracksFromPlaylist = (playlistUUID) =>
  MODELS.PlaylistTrackDB.destroy({ where: { playlist_uuid: playlistUUID } });

/**
 * @param {string} owner
 * @param {number} [offset]
 * @param {number} [limit]
 */
export const FindOwnedPlaylists = (owner, offset = 0, limit = 100) =>
  MODELS.PlaylistDB.findAll({ where: { owner }, limit, offset });

/**
 * @param {string} liker
 * @param {number} [offset]
 * @param {number} [limit]
 * @returns {Promise<import('../types/track').Track[]>}
 */
export const FindLikedTracks = (liker, offset = 0, limit = 100) =>
  MODELS.TrackLikeDB.findAll({
    where: { liker },
    limit,
    offset,
    include: [
      {
        model: MODELS.TrackDB,
        as: 'like_to_track',
      },
    ],
  })
    .then((likedTracks) => likedTracks.map((likedTrack) => likedTrack.like_to_track))
    .then(UnwrapModel);

/**
 * @param {string} liker
 * @param {string} trackUUID
 * @returns {Promise<import('../types/db-models').TrackLikeDB>}
 */
export const LikeTrack = (liker, trackUUID) =>
  MODELS.TrackLikeDB.create({
    liker,
    track_uuid: trackUUID,
  }).then(UnwrapModel);

/**
 * @param {string} liker
 * @param {string} trackUUID
 * @returns {Promise}
 */
export const UnlikeTrack = (liker, trackUUID) =>
  MODELS.TrackLikeDB.destroy({
    where: {
      liker,
      track_uuid: trackUUID,
    },
  });

/**
 * @param {string} liker
 * @param {number} [offset]
 * @param {number} [limit]
 * @returns {Promise<import('../types/playlist').PlaylistInfo[]>}
 */
export const FindLikedPlaylists = (liker, offset = 0, limit = 100) =>
  MODELS.PlaylistLikeDB.findAll({
    where: { liker },
    limit,
    offset,
    include: [
      {
        model: MODELS.PlaylistDB,
        as: 'like_to_playlist',
      },
    ],
  })
    .then((likedPlaylists) => likedPlaylists.map((likedPlaylist) => likedPlaylist.like_to_playlist))
    .then(UnwrapModel);

/**
 * @param {string} liker
 * @param {string} playlistUUID
 * @returns {Promise<import('../types/db-models').PlaylistLikeDB>}
 */
export const LikePlaylist = (liker, playlistUUID) =>
  MODELS.PlaylistLikeDB.create({
    liker,
    playlist_uuid: playlistUUID,
  }).then(UnwrapModel);

/**
 * @param {string} liker
 * @param {string} playlistUUID
 * @returns {Promise}
 */
export const UnlikePlaylist = (liker, playlistUUID) =>
  MODELS.PlaylistLikeDB.destroy({
    where: {
      liker,
      playlist_uuid: playlistUUID,
    },
  });
