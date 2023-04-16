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
    if (!association?.with) return;
    if (typeof association.with !== 'string') return;

    model[association.type](MODELS[association.with], {
      through: association.through ? MODELS[association.through] : undefined,
      foreignKey: association.foreignKey,
      as: association.as || `${association.type}_${association.with}`,
    });
  });
});

export default MODELS;
