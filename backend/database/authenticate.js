import { Sequelize } from 'sequelize';
import LoadConfig from '../util/load-configs.js';
import LogMessageOrError from '../util/log.js';

const sequelize = new Sequelize({
  dialect: 'postgres',
  ...LoadConfig('db'),
  logging: false,
  define: {
    timestamps: false,
  },
});

sequelize.authenticate().catch(LogMessageOrError);

export default sequelize;
