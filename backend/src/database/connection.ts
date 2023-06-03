import { Sequelize } from 'sequelize';
import LoadConfig from '../util/load-configs.js';
import LogMessageOrError from '../util/log.js';

const sequelizeConnection = new Sequelize({
  dialect: 'postgres',
  ...LoadConfig('db'),
  logging: false,
  define: {
    timestamps: false,
  },
});

sequelizeConnection.authenticate().catch(LogMessageOrError);

export default sequelizeConnection;
