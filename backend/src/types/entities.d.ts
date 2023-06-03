export interface User {
  /** Limited by 64 chars */
  username: string;
  /** Limited by hashing config */
  password_hash: string;
  /** Limited by hashing config */
  password_salt: string;
  is_admin: boolean;
}

export interface Session {
  /** Limited by 64 chars */
  session_token: string;
  /** Username */
  owner: string;
  until: Date;
}

interface MediaEntity {
  uuid: string;
}

export interface Track extends MediaEntity {
  /** Duration of the uploaded file (in seconds) */
  duration: number;
  /** @default "audio/mpeg" */
  mime_type: string;
  /** Username of uploader */
  owner: string;
  title: string;
  artist_name: string;
}

type PartialWithRequired<T, K extends keyof T> = Partial<T> & Pick<T, K>;
type PartialWithRequiredUUID<T extends { uuid: string }> = Partial<T> & Pick<T, 'uuid'>;
type UploadingEntity<T extends { uuid: string }, O extends keyof T> = Omit<PartialWithRequiredUUID<T>, O>;

export type UploadingTrack = UploadingEntity<Track, 'duration' | 'mime_type' | 'owner'>;

export interface Playlist extends MediaEntity {
  /** Combined duration of tracks in this playlist (in seconds) */
  sum_duration: number;
  /** Username of uploader */
  owner: string;
  title: string;
}
export type UploadingPlaylist = UploadingEntity<Playlist, 'sum_duration' | 'owner'>;

export type PlaylistFull = Playlist & { tracks_in_playlist: Track[] };

export interface PlaylistSavingPositions {
  /** Playlist UUID */
  uuid: string;
  /** UUID of tracks in order */
  positions: string[];
}

export interface SearchResult {
  entity: 'track' | 'playlist';
  uuid: string;
  title: string;
  /** From `duration` for tracks and `sum_durations` for playlists */
  duration: number;
  artist_name?: string;
}
