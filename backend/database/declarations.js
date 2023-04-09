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
      playlist_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: 'track_unique_position',
      },
      track_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: 'track_unique_position',
      },
      position: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        unique: 'track_unique_position',
      },
    },
    noPrimaryKey: true,
  },

  TrackLikeDB: {
    tableName: 'tracks_likes',
    attributes: {
      track_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: 'track_like',
      },
      owner: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: 'track_like',
      },
    },
    noPrimaryKey: true,
  },

  PlaylistLikeDB: {
    tableName: 'playlists_likes',
    attributes: {
      playlist_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: 'playlist_like',
      },
      owner: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: 'playlist_like',
      },
    },
    noPrimaryKey: true,
  },
};

export default DECLARATIONS;
