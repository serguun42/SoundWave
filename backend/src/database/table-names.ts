import { ModelsToTables } from '../types/db.js';

const TABLE_NAMES: ModelsToTables = {
  UserModel: 'users',
  SessionModel: 'sessions',
  TrackModel: 'tracks',
  PlaylistModel: 'playlists',
  PlaylistTrackModel: 'playlists_tracks',
  TrackLikeModel: 'tracks_likes',
  PlaylistLikeModel: 'playlists_likes',
} as const;

export default TABLE_NAMES;
