import { Sequelize } from 'sequelize';
import { LoadDBConfig } from '../util/load-configs.js';
import LogMessageOrError from '../util/log.js';
import DECLARATIONS from './declarations.js';

const sequelize = new Sequelize({
  dialect: 'postgres',
  ...LoadDBConfig(),
  logging: false,
  define: {
    timestamps: false,
  },
});

sequelize.authenticate().catch(LogMessageOrError);

/** @type {import('../types/db-models').ModelsDict} */
export const MODELS = {};

Object.keys(DECLARATIONS).forEach(
  /** @param {import('../types/db-models').ModelNames} modelName */ (modelName) => {
    const { tableName, attributes, noPrimaryKey } = DECLARATIONS[modelName];

    MODELS[modelName] = sequelize.define(tableName, attributes);
    if (noPrimaryKey) MODELS[modelName].removeAttribute('id');
  }
);

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
export const GetPlaylist = (uuid) => MODELS.PlaylistDB.findOne({ where: { uuid } });

/**
 * @param {string} owner
 * @param {number} [skip]
 * @param {number} [limit]
 */
export const FindOwnedPlaylists = (owner, skip = 0, limit = 100) =>
  MODELS.PlaylistDB.findAll({ where: { owner }, limit, offset: skip });

/**
 * @param {string} playlistUUID
 * @param {number} [skip]
 * @param {number} [limit]
 */
export const GetTracksInPlaylist = (playlistUUID, skip = 0, limit = 100) =>
  MODELS.PlaylistTrackDB.findAll({ where: { playlist_uuid: playlistUUID }, limit, offset: skip });

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
