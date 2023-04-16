export type UserDB = {
  /** Limited by 64 chars */
  username: string;
  /** Limited by hashing config */
  password_hash: string;
  /** Limited by hashing config */
  password_salt: string;
  is_admin: boolean;
};

export type TrackDB = {
  uuid: string;
  /** Duration of the uploaded file (in seconds) */
  duration: number;
  /** @default "audio/mpeg" */
  mime_type: string;
  /** Username of uploader */
  owner: string;
  title: string;
  artist_name: string;
};

export type PlaylistDB = {
  uuid: string;
  /** Combined duration of tracks in this playlist (in seconds) */
  sum_duration: number;
  /** Username of uploader */
  owner: string;
  title: string;
};

export type PlaylistTrackDB = {
  playlist_uuid: string;
  track_uuid: string;
  /** Position of track in the playlist */
  position: number;
};

export type TrackLikeDB = {
  track_uuid: string;
  liker: string;
};

export type PlaylistLikeDB = {
  playlist_uuid: string;
  liker: string;
};

export type ModelNamesToEntities = {
  UserDB: UserDB;
  TrackDB: TrackDB;
  PlaylistDB: PlaylistDB;
  PlaylistTrackDB: PlaylistTrackDB;
  TrackLikeDB: TrackLikeDB;
  PlaylistLikeDB: PlaylistLikeDB;
};

export type ModelNamesToTableNames = {
  UserDB: 'users';
  TrackDB: 'tracks';
  PlaylistDB: 'playlists';
  PlaylistTrackDB: 'playlists_tracks';
  TrackLikeDB: 'tracks_likes';
  PlaylistLikeDB: 'playlists_likes';
};

export type ModelNames = keyof ModelNamesToEntities;
type Model<TEntity> = import('sequelize').Model<TEntity, TEntity>;

type TableNames = ModelNamesToTableNames[keyof ModelNamesToTableNames];

type KeysOfUnion<T> = T extends T ? keyof T : never;
type Association = {
  type: 'hasOne' | 'hasMany' | 'belongsTo' | 'belongsToMany';
  with: ModelNames;
  foreignKey?: KeysOfUnion<ModelNamesToEntities[ModelNames]>;
  through?: ModelNames;
  as?: string;
};

export type ModelDeclarations = {
  [modelName in ModelNames]: {
    tableName: ModelNamesToTableNames[modelName];
    attributes: import('sequelize').ModelAttributes<
      Model<ModelNamesToEntities[modelName]>,
      ModelNamesToEntities[modelName]
    >;
    associations?: Association[];
    noPrimaryKey?: boolean;
  };
};

export type ModelsDict = {
  [modelName in ModelNames]: import('sequelize').ModelStatic<Model<ModelNamesToEntities[modelName]>>;
};

export type UnwrapEntity = (<TEntity>(model: Model<TEntity>) => TEntity) &
  (<TEntity>(model: Model<TEntity>[]) => TEntity[]);