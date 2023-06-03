import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from '../../types/entities.js';
import SessionModel from './session.js';
import TrackModel from './track.js';
import PlaylistModel from './playlist.js';
import TrackLikeModel from '../relations/track-like.js';
import PlaylistLikeModel from '../relations/playlist-like.js';

@Entity('users')
export default class UserModel implements User {
  @PrimaryColumn({ type: 'string', length: 64 })
  declare username: string;

  @Column({ type: 'char', length: 128 })
  declare password_hash: string;

  @Column({ type: 'char', length: 64 })
  declare password_salt: string;

  @Column({ type: 'boolean' })
  declare is_admin: boolean;

  @OneToMany(() => SessionModel, (session) => session.owner)
  declare sessions: SessionModel[];

  @OneToMany(() => TrackModel, (track) => track.owner)
  declare tracks: TrackModel[];

  @OneToMany(() => PlaylistModel, (playlist) => playlist.owner)
  declare playlists: PlaylistModel[];

  @OneToMany(() => TrackLikeModel, (trackLike) => trackLike.liker)
  declare trackLikes: TrackLikeModel[];

  @OneToMany(() => PlaylistLikeModel, (playlistLike) => playlistLike.liker)
  declare playlistLikes: PlaylistLikeModel[];
}
