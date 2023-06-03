import { DataTypes } from 'sequelize';
import { ModelDeclarations } from '../types/db.js';

const DECLARATIONS: ModelDeclarations = {
  UserModel: {
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
        with: 'SessionModel',
        foreignKey: 'owner',
      },
      {
        type: 'hasMany',
        with: 'TrackModel',
        foreignKey: 'owner',
      },
      {
        type: 'hasMany',
        with: 'PlaylistModel',
        foreignKey: 'owner',
      },
      {
        type: 'hasMany',
        with: 'TrackLikeModel',
        foreignKey: 'liker',
      },
      {
        type: 'hasMany',
        with: 'PlaylistLikeModel',
        foreignKey: 'liker',
      },
    ],
  },

  SessionModel: {
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
        with: 'UserModel',
        foreignKey: 'owner',
        as: 'session_to_user',
      },
    ],
  },

  TrackModel: {
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
        with: 'UserModel',
        foreignKey: 'owner',
      },
      {
        type: 'belongsToMany',
        with: 'PlaylistModel',
        through: 'PlaylistTrackModel',
        foreignKey: 'track_uuid',
      },
      {
        type: 'hasMany',
        with: 'PlaylistTrackModel',
        foreignKey: 'track_uuid',
        as: 'positions_of_track_in_playlists',
      },
      {
        type: 'hasMany',
        with: 'TrackLikeModel',
        foreignKey: 'track_uuid',
      },
    ],
  },

  PlaylistModel: {
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
        with: 'UserModel',
        foreignKey: 'owner',
      },
      {
        type: 'belongsToMany',
        with: 'TrackModel',
        through: 'PlaylistTrackModel',
        foreignKey: 'playlist_uuid',
        as: 'tracks_in_playlist',
      },
      {
        type: 'hasMany',
        with: 'PlaylistTrackModel',
        foreignKey: 'playlist_uuid',
        as: 'positions_of_tracks_in_playlist',
      },
      {
        type: 'hasMany',
        with: 'PlaylistLikeModel',
        foreignKey: 'playlist_uuid',
      },
    ],
  },

  PlaylistTrackModel: {
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
        with: 'TrackModel',
        foreignKey: 'track_uuid',
        as: 'tracks_by_playlist',
      },
      {
        type: 'belongsTo',
        with: 'PlaylistModel',
        foreignKey: 'playlist_uuid',
        as: 'playlists_by_track',
      },
    ],
    noPrimaryKey: true,
  },

  TrackLikeModel: {
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
        with: 'TrackModel',
        foreignKey: 'track_uuid',
        as: 'like_to_track',
      },
      {
        type: 'belongsTo',
        with: 'UserModel',
        foreignKey: 'liker',
      },
    ],
    noPrimaryKey: true,
  },

  PlaylistLikeModel: {
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
        with: 'PlaylistModel',
        foreignKey: 'playlist_uuid',
        as: 'like_to_playlist',
      },
      {
        type: 'belongsTo',
        with: 'UserModel',
        foreignKey: 'liker',
      },
    ],
    noPrimaryKey: true,
  },
};

export default DECLARATIONS;
