import UnwrapModel from '../util/unwrap-model.js';
import MODELS from './models.js';

/** @param {string} username */
export const GetUser = (username) => MODELS.UserDB.findOne({ where: { username } });

/** @param {import('../types/db-models').UserDB} user */
export const InsertUser = (user) => MODELS.UserDB.create(user);

/** @param {string} uuid */
export const GetTrack = (uuid) => MODELS.TrackDB.findOne({ where: { uuid } });

/**
 * @param {string} owner
 * @param {number} [skip]
 * @param {number} [limit]
 */
export const FindOwnedTracks = (owner, skip = 0, limit = 100) =>
  MODELS.TrackDB.findAll({ where: { owner }, limit, offset: skip });

/** @param {string} uuid */
export const GetPlaylistInfo = (uuid) => MODELS.PlaylistDB.findOne({ where: { uuid } });

/**
 * @param {string} playlistUUID
 * @returns {Promise<import('../types/playlist').PlaylistFull>}
 */
export const GetFullPlaylist = (playlistUUID) =>
  MODELS.PlaylistDB.findOne({
    where: { uuid: playlistUUID },
    include: {
      model: MODELS.TrackDB,
      as: 'tracks_for_full_playlist',
    },
  }).then(
    /** @returns {Promise<import('../types/playlist.js').PlaylistFull>} */ (fullPlaylist) =>
      Promise.resolve({
        ...UnwrapModel(fullPlaylist),
        tracks_for_full_playlist: UnwrapModel(fullPlaylist.tracks_for_full_playlist).map((trackInPlaylist) => {
          trackInPlaylist.position = trackInPlaylist.playlists_tracks?.position || 0;
          delete trackInPlaylist.playlists_tracks;
          return trackInPlaylist;
        }),
      })
  );

/**
 * @param {string} playlistUUID
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
      position: trackByPlaylist.position,
      ...UnwrapModel(trackByPlaylist.tracks_by_playlist),
    }))
  );

/**
 * @param {string} owner
 * @param {number} [skip]
 * @param {number} [limit]
 */
export const FindOwnedPlaylists = (owner, skip = 0, limit = 100) =>
  MODELS.PlaylistDB.findAll({ where: { owner }, limit, offset: skip });

/**
 * @param {string} owner
 * @param {number} [skip]
 * @param {number} [limit]
 */
export const FindLikedTracks = (owner, skip = 0, limit = 100) =>
  MODELS.TrackLikeDB.findAll({ where: { owner }, limit, offset: skip });

/**
 * @param {string} owner
 * @param {number} [skip]
 * @param {number} [limit]
 */
export const FindLikedPlaylists = (owner, skip = 0, limit = 100) =>
  MODELS.PlaylistLikeDB.findAll({ where: { owner }, limit, offset: skip });
