import dataSourceConnection from './connection.js';
import PlaylistModel from './models/playlist.js';
import SessionModel from './models/session.js';
import TrackModel from './models/track.js';
import UserModel from './models/user.js';
import PlaylistLikeModel from './relations/playlist-like.js';
import PlaylistTrackModel from './relations/playlist-track.js';
import TrackLikeModel from './relations/track-like.js';

const REPOSITORY = {
  UserRepo: dataSourceConnection.getRepository(UserModel),
  SessionRepo: dataSourceConnection.getRepository(SessionModel),
  TrackRepo: dataSourceConnection.getRepository(TrackModel),
  PlaylistRepo: dataSourceConnection.getRepository(PlaylistModel),
  PlaylistTrackRepo: dataSourceConnection.getRepository(PlaylistTrackModel),
  TrackLikeRepo: dataSourceConnection.getRepository(TrackLikeModel),
  PlaylistLikeRepo: dataSourceConnection.getRepository(PlaylistLikeModel),
} as const;

export default REPOSITORY;
