import { PlaylistDB } from './db-models';
import { TrackInPlaylist } from './track';

export type PlaylistInfo = PlaylistDB;

export type PlaylistFull = PlaylistInfo & { tracks_in_playlist: TrackInPlaylist[] };

export type PlaylistSavingPositions = {
  playlistUUID: string;
  positions: {
    trackUUID: string;
    position: number;
  }[];
};
