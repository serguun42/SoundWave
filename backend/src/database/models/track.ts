import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, Relation } from 'typeorm';
import { Track } from '../../types/entities.js';
import UserModel from './user.js';
import PlaylistTrackModel from '../relations/playlist-track.js';
import TrackLikeModel from '../relations/track-like.js';

@Entity('tracks')
export default class TrackModel implements Track {
  @PrimaryColumn({ type: 'uuid', default: 'gen_random_uuid()' })
  declare uuid: string;

  @Column({ type: 'real', default: 0, nullable: true })
  declare duration: number;

  @Column({ type: 'varchar', length: 128, default: 'audio/mpeg', nullable: true })
  declare mime_type: string;

  @Column({ type: 'varchar', length: 64, foreignKeyConstraintName: 'fk_owner' })
  declare owner: string;

  @Column({ type: 'varchar', length: 255 })
  declare title: string;

  @Column({ type: 'varchar', length: 255 })
  declare artist_name: string;

  @ManyToOne(() => UserModel, (user) => user.tracks)
  @JoinColumn({ name: 'owner', referencedColumnName: 'username', foreignKeyConstraintName: 'fk_owner' })
  declare ownerUser: Relation<UserModel>;

  @OneToMany(() => PlaylistTrackModel, (playlistTrack) => playlistTrack.track)
  declare trackPlaylists: Relation<PlaylistTrackModel>[];

  @OneToMany(() => TrackLikeModel, (trackLike) => trackLike.track)
  declare trackLikes: Relation<TrackLikeModel>[];
}
