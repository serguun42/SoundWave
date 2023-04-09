export type UserDB = {
  /** Limited with 64 chars */
  username: string;
  /** Limited with hashing config */
  password_hash: string;
  /** Limited with hashing config */
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
  id: number;
  playlist_uuid: string;
  track_uuid: string;
  /** Position of track in the playlist */
  position: number;
};

type ModelNamesToEntities = {
  UserDB: UserDB;
  TrackDB: TrackDB;
  PlaylistDB: PlaylistDB;
  PlaylistTrackDB: PlaylistTrackDB;
};

type ModelNamesToTableNames = {
  UserDB: 'users';
  TrackDB: 'tracks';
  PlaylistDB: 'playlists';
  PlaylistTrackDB: 'playlists_tracks';
};

export type ModelNames = keyof ModelNamesToEntities;

type CreatingAttributes<T extends ModelNames> = import('sequelize').ModelAttributes<
  import('sequelize').Model<ModelNamesToEntities[T], any>,
  ModelNamesToEntities[T]
>;

export type ModelDeclarations = {
  [modelName in ModelNames]: {
    tableName: ModelNamesToTableNames[modelName];
    attributes: CreatingAttributes<modelName>;
  };
};

export type ModelsCollection = {
  [modelName in ModelNames]: import('sequelize').ModelStatic<
    import('sequelize').Model<ModelNamesToEntities[modelName], ModelNamesToEntities[modelName]>
  >;
};
