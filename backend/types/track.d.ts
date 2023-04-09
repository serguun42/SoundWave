import { TrackDB } from './db-models';

export type Track = TrackDB;
export type TrackInPlaylist = TrackDB & { position: number };
