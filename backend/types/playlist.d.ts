import { PlaylistDB } from './db-models';
import { Track } from './track';

export type PlaylistInfo = PlaylistDB;

export type PlaylistFull = PlaylistInfo & { tracks_for_full_playlist: TrackInPlaylist[] };
