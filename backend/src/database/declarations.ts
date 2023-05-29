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
        with: 'SessionDB',
        foreignKey: 'owner',
      },
      {
        type: 'hasMany',
        with: 'TrackDB',
        foreignKey: 'owner',
      },
      {
        type: 'hasMany',
        with: 'PlaylistDB',
        foreignKey: 'owner',
      },
      {
        type: 'hasMany',
        with: 'TrackLikeDB',
        foreignKey: 'liker',
      },
      {
        type: 'hasMany',
        with: 'PlaylistLikeDB',
        foreignKey: 'liker',
      },
    ],
  },

  SessionDB: {
    tableName: 'sessions',
    attributes: {
      session_token: {
        type: DataTypes.STRING(64),
        allowNull: false,
        primaryKey: true,
      },
      owner: {
        type: DataTypes.STRING(64),
        allowNull: false,
        references: {
          model: 'users',
          key: 'username',
        },
      },
      until: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    associations: [
      {
        type: 'belongsTo',
        with: 'UserDB',
        foreignKey: 'owner',
        as: 'session_to_user',
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
        type: 'belongsToMany',
        with: 'PlaylistDB',
        through: 'PlaylistTrackDB',
        foreignKey: 'track_uuid',
      },
      {
        type: 'hasMany',
        with: 'PlaylistTrackDB',
        foreignKey: 'track_uuid',
        as: 'positions_of_track',
      },
      {
        type: 'hasMany',
        with: 'TrackLikeDB',
        foreignKey: 'track_uuid',
        as: 'tracks_to_likes',
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
        type: 'belongsToMany',
        with: 'TrackDB',
        through: 'PlaylistTrackDB',
        foreignKey: 'playlist_uuid',
        as: 'tracks_in_playlist',
      },
      {
        type: 'hasMany',
        with: 'PlaylistTrackDB',
        foreignKey: 'playlist_uuid',
        as: 'positions_in_playlist',
      },
      {
        type: 'hasMany',
        with: 'PlaylistLikeDB',
        foreignKey: 'playlist_uuid',
        as: 'playlist_to_likes',
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
        unique: 'playlist_track_unique',
        references: {
          model: 'playlists',
          key: 'uuid',
        },
      },
      track_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: 'playlist_track_unique',
        references: {
          model: 'tracks',
          key: 'uuid',
        },
      },
      position: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        primaryKey: true,
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
      liker: {
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
        as: 'like_to_track',
      },
      {
        type: 'belongsTo',
        with: 'UserDB',
        foreignKey: 'liker',
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
      liker: {
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
        as: 'like_to_playlist',
      },
      {
        type: 'belongsTo',
        with: 'UserDB',
        foreignKey: 'liker',
      },
    ],
    noPrimaryKey: true,
  },
};

export default DECLARATIONS;
