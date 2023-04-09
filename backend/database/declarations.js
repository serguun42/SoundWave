import { DataTypes } from 'sequelize';

/** @type {import('../types/db-models').ModelDeclarations} */
const DECLARATIONS = {
  UserDB: {
    tableName: 'users',
    attributes: {
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
  },

  TrackDB: {
    tableName: 'tracks',
    attributes: {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      duration: {
        type: DataTypes.REAL,
        defaultValue: 0,
      },
      mime_type: {
        type: DataTypes.STRING(128),
        defaultValue: 'audio/mpeg',
      },
      owner: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      artist_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
  },

  PlaylistDB: {
    tableName: 'playlists',
    attributes: {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      sum_duration: {
        type: DataTypes.REAL,
        defaultValue: 0,
      },
      owner: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
  },

  PlaylistTrackDB: {
    tableName: 'playlists_tracks',
    attributes: {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      playlist_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      track_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      position: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
  },
};

export default DECLARATIONS;
