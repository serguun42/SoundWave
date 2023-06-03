import { DataSource } from 'typeorm';
import LoadConfig from '../util/load-configs.js';
import LogMessageOrError from '../util/log.js';
import IS_DEV from '../util/is-dev.js';
import PlaylistModel from './models/playlist.js';
import UserModel from './models/user.js';
import SessionModel from './models/session.js';
import TrackModel from './models/track.js';
import PlaylistTrackModel from './relations/playlist-track.js';
import TrackLikeModel from './relations/track-like.js';
import PlaylistLikeModel from './relations/playlist-like.js';

const dataSoureConnection = new DataSource({
  type: 'postgres',
  ...LoadConfig('db'),
  logging: IS_DEV ? ['error', 'warn', 'query', 'info'] : ['error', 'warn'],
  logger: IS_DEV ? 'advanced-console' : 'simple-console',
  entities: [UserModel, SessionModel, TrackModel, PlaylistModel, PlaylistTrackModel, TrackLikeModel, PlaylistLikeModel],
});

dataSoureConnection.initialize().catch(LogMessageOrError);

export default dataSoureConnection;
