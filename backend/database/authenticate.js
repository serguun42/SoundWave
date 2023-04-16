import { Sequelize } from 'sequelize';
import { LoadDBConfig } from '../util/load-configs.js';
import LogMessageOrError from '../util/log.js';

const sequelize = new Sequelize({
  dialect: 'postgres',
  ...LoadDBConfig(),
  logging: false,
  define: {
    timestamps: false,
  },
});

sequelize.authenticate().catch(LogMessageOrError);

export default sequelize;
