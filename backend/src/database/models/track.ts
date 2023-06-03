import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Track } from '../../types/entities.js';
import UserModel from './user.js';
import PlaylistTrackModel from '../relations/playlist-track.js';
import TrackLikeModel from '../relations/track-like.js';

@Entity('tracks')
export default class TrackModel implements Track {
  @PrimaryGeneratedColumn('uuid')
  declare uuid: string;

  @Column({ type: 'real', default: 0, nullable: true })
  declare duration: number;

  @Column({ type: 'string', length: 128, default: 'audio / mpeg', nullable: true })
  declare mime_type: string;

  @ManyToOne(() => UserModel, (user) => user.tracks)
  @JoinColumn({ name: 'owner', referencedColumnName: 'username', foreignKeyConstraintName: 'fk_owner' })
  declare owner: string;

  @Column({ type: 'string', length: 255 })
  declare title: string;

  @Column({ type: 'string', length: 255 })
  declare artist_name: string;

  @OneToMany(() => PlaylistTrackModel, (playlistTrack) => playlistTrack.playlist_uuid)
  declare trackPlaylists: PlaylistTrackModel[];

  @OneToMany(() => TrackLikeModel, (trackLike) => trackLike.liker)
  declare trackLikes: TrackLikeModel[];
}
