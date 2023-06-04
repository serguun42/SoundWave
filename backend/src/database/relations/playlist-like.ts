import { Entity, JoinColumn, ManyToOne, PrimaryColumn, Relation, Unique } from 'typeorm';
import { PlaylistLikeRelation } from '../../types/db.js';
import UserModel from '../models/user.js';
import PlaylistModel from '../models/playlist.js';

@Entity('playlists_likes')
@Unique('playlist_like', ['playlist_uuid', 'liker'])
export default class PlaylistLikeModel implements PlaylistLikeRelation {
  @PrimaryColumn({ type: 'uuid', unique: true, foreignKeyConstraintName: 'fk_track_uuid' })
  declare playlist_uuid: string;

  @PrimaryColumn({ type: 'varchar', length: 64, unique: true, foreignKeyConstraintName: 'fk_owner' })
  declare liker: string;

  @ManyToOne(() => PlaylistModel, (playlist) => playlist.playlistLikes)
  @JoinColumn({ name: 'playlist_uuid', referencedColumnName: 'uuid', foreignKeyConstraintName: 'fk_track_uuid' })
  declare playlist: Relation<PlaylistModel>;

  @ManyToOne(() => UserModel, (user) => user.playlistLikes)
  @JoinColumn({ name: 'liker', referencedColumnName: 'username', foreignKeyConstraintName: 'fk_owner' })
  declare likerUser: Relation<UserModel>;
}
