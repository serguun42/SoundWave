import { User, Session, Track, Playlist } from './entities.js';

export type PlaylistTrackRelation = {
  playlist_uuid: string;
  track_uuid: string;
  /** Position of track in the playlist */
  position: number;
};

export type TrackLikeRelation = {
  track_uuid: string;
  liker: string;
};

export type PlaylistLikeRelation = {
  playlist_uuid: string;
  liker: string;
};

type ModelsToEntities = {
  UserModel: User;
  SessionModel: Session;
  TrackModel: Track;
  PlaylistModel: Playlist;
  PlaylistTrackModel: PlaylistTrackRelation;
  TrackLikeModel: TrackLikeRelation;
  PlaylistLikeModel: PlaylistLikeRelation;
};

export type ModelNames = keyof ModelsToEntities;
export type ModelsToTables = {
  [modelName in ModelNames]: string;
};
type Entities = ModelsToEntities[keyof ModelsToEntities];
export type ModelFromDB<TAttributes> = import('sequelize').Model<TAttributes, TAttributes>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
type Association = {
  type: 'hasOne' | 'hasMany' | 'belongsTo' | 'belongsToMany';
  with: ModelNames;
  foreignKey?: KeysOfUnion<ModelsToEntities[ModelNames]>;
  through?: ModelNames;
  as?: string;
};

export type ModelDeclarations = {
  [modelName in ModelNames]: {
    attributes: import('sequelize').ModelAttributes<
      ModelFromDB<ModelsToEntities[modelName]>,
      ModelsToEntities[modelName]
    >;
    associations?: Association[];
    noPrimaryKey?: boolean;
  };
};

export type DefaultEmptyModel = import('sequelize').ModelStatic<ModelFromDB<unknown>>;
