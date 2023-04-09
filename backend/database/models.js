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
const MODELS = {};
/** @type {import('../types/db-models').ModelNames[]} */
const modelNames = Object.keys(DECLARATIONS);

modelNames.forEach((modelName) => {
  const { tableName, attributes, noPrimaryKey } = DECLARATIONS[modelName];

  const model = sequelize.define(tableName, attributes);

  if (noPrimaryKey) model.removeAttribute('id');

  MODELS[modelName] = model;
});

modelNames.forEach((modelName) => {
  const { associations } = DECLARATIONS[modelName];
  if (!Array.isArray(associations)) return;

  const model = MODELS[modelName];

  associations.forEach((association) => {
    if (typeof association.with === 'string') association.with = [association.with];

    if (Array.isArray(association.with))
      association.with.forEach((withTable) => {
        model[association.type](MODELS[withTable], {
          through: association.through ? MODELS[association.through] : undefined,
          foreignKey: association.foreignKey,
          as: association.as || `${association.type}_${withTable}`,
        });
      });
  });
});

export default MODELS;
