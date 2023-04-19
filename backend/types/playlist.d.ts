import { PlaylistDB } from './db-models';
import { TrackInPlaylist } from './track';

export type PlaylistInfo = PlaylistDB;

export type PlaylistFull = PlaylistInfo & { tracks_in_playlist: TrackInPlaylist[] };

export type PlaylistSavingPositions = {
  /** Playlist UUID */
  uuid: string;
  /** UUID of tracks in order */
  positions: string[];
};
