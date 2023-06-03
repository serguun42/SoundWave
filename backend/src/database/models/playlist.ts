import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Playlist } from '../../types/entities.js';
import UserModel from './user.js';
import PlaylistTrackModel from '../relations/playlist-track.js';
import PlaylistLikeModel from '../relations/playlist-like.js';

@Entity('playlists')
export default class PlaylistModel implements Playlist {
  @PrimaryGeneratedColumn('uuid')
  declare uuid: string;

  @Column({ type: 'real', default: 0 })
  declare sum_duration: number;

  @ManyToOne(() => UserModel, (user) => user.playlists)
  @JoinColumn({ name: 'owner', referencedColumnName: 'username', foreignKeyConstraintName: 'fk_owner' })
  declare owner: string;

  @Column({ type: 'string', length: 255 })
  declare title: string;

  @OneToMany(() => PlaylistTrackModel, (playlistTrack) => playlistTrack.track_uuid)
  declare playlistTracks: PlaylistTrackModel[];

  @OneToMany(() => PlaylistLikeModel, (playlistLike) => playlistLike.liker)
  declare playlistLikes: PlaylistLikeModel[];
}
