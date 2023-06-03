/* eslint-disable max-classes-per-file */
import { Association, CreationOptional, Model, NonAttribute } from 'sequelize';
import {
  DefaultEmptyModel,
  ModelNames,
  PlaylistLikeRelation,
  PlaylistTrackRelation,
  TrackLikeRelation,
} from '../types/db.js';
import { User, Session, Track, Playlist } from '../types/entities.js';
import sequelizeConnection from './connection.js';
import DECLARATIONS from './declarations.js';
import TABLE_NAMES from './table-names.js';

export class UserModel extends Model<User> implements User {
  declare username: string;

  declare password_hash: string;

  declare password_salt: string;

  declare is_admin: boolean;
}

export class SessionModel extends Model<Session> implements Session {
  declare session_token: string;

  declare owner: string;

  declare until: Date;

  declare session_to_user?: NonAttribute<UserModel>;

  public declare static associations: {
    session_to_user: Association<SessionModel, UserModel>;
  };
}

export class TrackModel extends Model<Track> implements Track {
  declare uuid: CreationOptional<string>;

  declare duration: number;

  declare mime_type: string;

  declare owner: string;

  declare title: string;

  declare artist_name: string;

  declare positions_of_track_in_playlists?: NonAttribute<PlaylistTrackModel[]>;

  public declare static associations: {
    positions_of_track_in_playlists: Association<TrackModel, PlaylistTrackModel>;
  };
}

export class PlaylistModel extends Model<Playlist> implements Playlist {
  declare uuid: string;

  declare sum_duration: number;

  declare owner: string;

  declare title: string;

  declare tracks_in_playlist?: NonAttribute<TrackModel[]>;

  declare positions_of_tracks_in_playlist?: NonAttribute<PlaylistTrackModel[]>;

  public declare static associations: {
    tracks_in_playlist: Association<PlaylistModel, TrackModel>;
    positions_of_tracks_in_playlist: Association<PlaylistModel, PlaylistTrackModel>;
  };
}

export class PlaylistTrackModel extends Model<PlaylistTrackRelation> implements PlaylistTrackRelation {
  declare playlist_uuid: string;

  declare track_uuid: string;

  declare position: number;

  declare tracks_by_playlist?: NonAttribute<TrackModel>;

  declare playlists_by_track?: NonAttribute<PlaylistModel>;

  public declare static associations: {
    tracks_by_playlist: Association<PlaylistTrackModel, TrackModel>;
    playlists_by_track: Association<PlaylistTrackModel, PlaylistModel>;
  };
}

export class TrackLikeModel extends Model<TrackLikeRelation> implements TrackLikeRelation {
  declare track_uuid: string;

  declare liker: string;

  declare like_to_track?: NonAttribute<TrackModel>;

  public declare static associations: {
    like_to_track: Association<TrackLikeModel, TrackModel>;
  };
}

export class PlaylistLikeModel extends Model<PlaylistLikeRelation> implements PlaylistLikeRelation {
  declare playlist_uuid: string;

  declare liker: string;

  declare like_to_playlist?: NonAttribute<PlaylistModel>;

  public declare static associations: {
    like_to_playlist: Association<TrackLikeModel, PlaylistModel>;
  };
}

const MODELS = [UserModel, SessionModel, TrackModel, PlaylistModel];

MODELS.forEach((model) => {
  const { attributes, noPrimaryKey } = DECLARATIONS[model.name as ModelNames];

  model.init(attributes, { tableName: TABLE_NAMES[model.name as ModelNames], sequelize: sequelizeConnection });

  if (noPrimaryKey) model.removeAttribute('id');
});

MODELS.forEach((model) => {
  const { associations } = DECLARATIONS[model.name as ModelNames];
  if (!Array.isArray(associations)) return;

  associations.forEach((association) => {
    if (!association?.with) return;
    if (typeof association.with !== 'string') return;

    const targetModel = MODELS.find((seekingModel) => seekingModel.name === association.with);
    if (!targetModel) return;

    (model as DefaultEmptyModel)[association.type](targetModel as DefaultEmptyModel, {
      // TO-DO maybe revert to `undefined` instead of empty string
      through: association.through ? targetModel : '',
      foreignKey: association.foreignKey,
      as: association.as || `${association.type}_${association.with}`,
    });
  });
});
