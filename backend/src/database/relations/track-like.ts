import { Entity, JoinColumn, ManyToOne, PrimaryColumn, Relation, Unique } from 'typeorm';
import { TrackLikeRelation } from '../../types/db.js';
import UserModel from '../models/user.js';
import TrackModel from '../models/track.js';

@Entity('tracks_likes')
@Unique('track_like', ['track_uuid', 'liker'])
export default class TrackLikeModel implements TrackLikeRelation {
  @PrimaryColumn({ type: 'uuid', unique: true, foreignKeyConstraintName: 'fk_track_uuid' })
  declare track_uuid: string;

  @PrimaryColumn({ type: 'varchar', length: 64, unique: true, foreignKeyConstraintName: 'fk_owner' })
  declare liker: string;

  @ManyToOne(() => TrackModel, (playlist) => playlist.trackLikes)
  @JoinColumn({ name: 'track_uuid', referencedColumnName: 'uuid', foreignKeyConstraintName: 'fk_track_uuid' })
  declare track: Relation<TrackModel>;

  @ManyToOne(() => UserModel, (user) => user.trackLikes)
  @JoinColumn({ name: 'liker', referencedColumnName: 'username', foreignKeyConstraintName: 'fk_owner' })
  declare likerUser: Relation<UserModel>;
}
