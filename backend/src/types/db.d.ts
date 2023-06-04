import { Playlist, Track } from './entities.js';

export type PlaylistTrackRelation = {
  playlist_uuid: string | Playlist;
  track_uuid: string | Track;
  /** Position of track in the playlist */
  position: number;
};

export type TrackLikeRelation = {
  track_uuid: string | Track;
  liker: string;
};

export type PlaylistLikeRelation = {
  playlist_uuid: string | Playlist;
  liker: string;
};
