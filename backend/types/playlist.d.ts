import { PlaylistDB } from './db-models';
import { Track } from './track';

export type PlaylistInfo = PlaylistDB;

export type PlaylistFull = PlaylistInfo & { tracks_in_playlist: Track[] };

export type PlaylistSavingPositions = {
  /** Playlist UUID */
  uuid: string;
  /** UUID of tracks in order */
  positions: string[];
};
