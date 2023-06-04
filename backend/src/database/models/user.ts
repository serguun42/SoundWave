import { Column, Entity, OneToMany, PrimaryColumn, Relation } from 'typeorm';
import { User } from '../../types/entities.js';
import SessionModel from './session.js';
import TrackModel from './track.js';
import PlaylistModel from './playlist.js';
import TrackLikeModel from '../relations/track-like.js';
import PlaylistLikeModel from '../relations/playlist-like.js';

@Entity('users')
export default class UserModel implements User {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  declare username: string;

  @Column({ type: 'char', length: 128 })
  declare password_hash: string;

  @Column({ type: 'char', length: 64 })
  declare password_salt: string;

  @Column({ type: 'boolean' })
  declare is_admin: boolean;

  @OneToMany(() => SessionModel, (session) => session.ownerUser)
  declare sessions: Relation<SessionModel>[];

  @OneToMany(() => TrackModel, (track) => track.ownerUser)
  declare tracks: Relation<TrackModel>[];

  @OneToMany(() => PlaylistModel, (playlist) => playlist.ownerUser)
  declare playlists: Relation<PlaylistModel>[];

  @OneToMany(() => TrackLikeModel, (trackLike) => trackLike.likerUser)
  declare trackLikes: Relation<TrackLikeModel>[];

  @OneToMany(() => PlaylistLikeModel, (playlistLike) => playlistLike.likerUser)
  declare playlistLikes: Relation<PlaylistLikeModel>[];
}
