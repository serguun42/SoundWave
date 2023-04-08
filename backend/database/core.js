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

/** @typedef {import('sequelize').ModelCtor<import('sequelize').Model<any, any>>} ModelInstance */
/** @type {{ [key in import('./declarations.js').ModelNames]: ModelInstance }} */
const modelInstances = {};
Object.keys(DECLARATIONS).forEach((modelName) => {
  modelInstances[modelName] = sequelize.define(modelName, DECLARATIONS[modelName]);
});

/**
 * @returns {Promise<import('../types/db-models').UserDB[]>}
 */
export const FindAllUsers = () => modelInstances.users.findAll();

/**
 * @param {string} username
 * @returns {Promise<import('../types/db-models').UserDB>}
 */
export const FindUser = (username) => modelInstances.users.findOne({ where: { username } });
