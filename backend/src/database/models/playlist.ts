import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, Relation } from 'typeorm';
import { Playlist } from '../../types/entities.js';
import UserModel from './user.js';
import PlaylistTrackModel from '../relations/playlist-track.js';
import PlaylistLikeModel from '../relations/playlist-like.js';

@Entity('playlists')
export default class PlaylistModel implements Playlist {
  @PrimaryColumn({ type: 'uuid', default: 'gen_random_uuid()' })
  declare uuid: string;

  @Column({ type: 'real', default: 0 })
  declare sum_duration: number;

  @Column({ type: 'varchar', length: 64, foreignKeyConstraintName: 'fk_owner' })
  declare owner: string;

  @Column({ type: 'varchar', length: 255 })
  declare title: string;

  @ManyToOne(() => UserModel, (user) => user.playlists)
  @JoinColumn({ name: 'owner', referencedColumnName: 'username', foreignKeyConstraintName: 'fk_owner' })
  declare ownerUser: Relation<UserModel>;

  @OneToMany(() => PlaylistTrackModel, (playlistTrack) => playlistTrack.playlist)
  declare playlistTracks: Relation<PlaylistTrackModel>[];

  @OneToMany(() => PlaylistLikeModel, (playlistLike) => playlistLike.playlist)
  declare playlistLikes: Relation<PlaylistLikeModel>[];
}
