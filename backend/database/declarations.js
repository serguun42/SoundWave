import { DataTypes } from 'sequelize';

const DECLARATIONS = {
  /** @type {import('sequelize').ModelAttributes<import('sequelize').Model<any, any>, any>} */
  users: {
    username: {
      type: DataTypes.STRING(64),
      allowNull: false,
      primaryKey: true,
    },
    password_hash: {
      type: DataTypes.CHAR(128),
      allowNull: false,
    },
    password_salt: {
      type: DataTypes.CHAR(64),
      allowNull: false,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
};

/** @typedef {keyof DECLARATIONS} ModelNames */

export default DECLARATIONS;
