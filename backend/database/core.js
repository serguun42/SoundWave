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

/** @type {import('../types/db-models').ModelsCollection} */
export const MODELS = {};

Object.keys(DECLARATIONS).forEach(
  /** @param {import('../types/db-models').ModelNames} modelName */ (modelName) => {
    const { tableName, attributes } = DECLARATIONS[modelName];

    MODELS[modelName] = sequelize.define(tableName, attributes);
  }
);

export const FindAllUsers = () => MODELS.UserDB.findAll();

/** @param {string} username */
export const FindUser = (username) => MODELS.UserDB.findOne({ where: { username } });

export const FindAllTracks = () => MODELS.TrackDB.findAll();

export const FindAllPlaylists = () => MODELS.PlaylistDB.findAll();

export const FindAllPlaylistsTracks = () => MODELS.PlaylistTrackDB.findAll();
