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
    associations: [
      {
        type: 'hasMany',
        with: ['TrackDB', 'PlaylistDB', 'TrackLikeDB', 'PlaylistLikeDB'],
        foreignKey: 'owner',
      },
    ],
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
        references: {
          model: 'users',
          key: 'username',
        },
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
    associations: [
      {
        type: 'belongsTo',
        with: 'UserDB',
        foreignKey: 'owner',
      },
      {
        type: 'hasMany',
        with: ['PlaylistTrackDB', 'TrackLikeDB'],
        foreignKey: 'track_uuid',
      },
      {
        type: 'belongsToMany',
        with: 'PlaylistDB',
        through: 'PlaylistTrackDB',
        foreignKey: 'track_uuid',
      },
    ],
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
        references: {
          model: 'users',
          key: 'username',
        },
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    associations: [
      {
        type: 'belongsTo',
        with: 'UserDB',
        foreignKey: 'owner',
      },
      {
        type: 'hasMany',
        with: ['PlaylistTrackDB', 'PlaylistLikeDB'],
        foreignKey: 'playlist_uuid',
      },
      {
        type: 'belongsToMany',
        with: 'TrackDB',
        through: 'PlaylistTrackDB',
        foreignKey: 'playlist_uuid',
        as: 'tracks_for_full_playlist',
      },
    ],
  },

  PlaylistTrackDB: {
    tableName: 'playlists_tracks',
    attributes: {
      playlist_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: 'track_unique_position',
        references: {
          model: 'playlists',
          key: 'uuid',
        },
      },
      track_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: 'track_unique_position',
        references: {
          model: 'tracks',
          key: 'uuid',
        },
      },
      position: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        primaryKey: true,
        unique: 'track_unique_position',
      },
    },
    associations: [
      {
        type: 'belongsTo',
        with: 'TrackDB',
        foreignKey: 'track_uuid',
        as: 'tracks_by_playlist',
      },
      {
        type: 'belongsTo',
        with: 'PlaylistDB',
        foreignKey: 'playlist_uuid',
        as: 'playlists_by_track',
      },
    ],
    noPrimaryKey: true,
  },

  TrackLikeDB: {
    tableName: 'tracks_likes',
    attributes: {
      track_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: 'track_like',
        references: {
          model: 'tracks',
          key: 'uuid',
        },
      },
      owner: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: 'track_like',
        references: {
          model: 'users',
          key: 'username',
        },
      },
    },
    associations: [
      {
        type: 'belongsTo',
        with: 'TrackDB',
        foreignKey: 'track_uuid',
      },
      {
        type: 'belongsTo',
        with: 'UserDB',
        foreignKey: 'owner',
      },
    ],
    noPrimaryKey: true,
  },

  PlaylistLikeDB: {
    tableName: 'playlists_likes',
    attributes: {
      playlist_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: 'playlist_like',
        references: {
          model: 'playlists',
          key: 'uuid',
        },
      },
      owner: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: 'playlist_like',
        references: {
          model: 'users',
          key: 'username',
        },
      },
    },
    associations: [
      {
        type: 'belongsTo',
        with: 'PlaylistDB',
        foreignKey: 'playlist_uuid',
      },
      {
        type: 'belongsTo',
        with: 'UserDB',
        foreignKey: 'owner',
      },
    ],
    noPrimaryKey: true,
  },
};

export default DECLARATIONS;
