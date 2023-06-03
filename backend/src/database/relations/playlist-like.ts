import { Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { PlaylistLikeRelation } from '../../types/db.js';
import UserModel from '../models/user.js';
import PlaylistModel from '../models/playlist.js';

@Entity('playlists_likes')
@Unique('playlist_like', ['playlist_uuid', 'liker'])
export default class PlaylistLikeModel implements PlaylistLikeRelation {
  @ManyToOne(() => PlaylistModel, (playlist) => playlist.playlistLikes)
  @JoinColumn({ name: 'v', referencedColumnName: 'uuid', foreignKeyConstraintName: 'fk_track_uuid' })
  declare playlist_uuid: string;

  @ManyToOne(() => UserModel, (user) => user.playlistLikes)
  @JoinColumn({ name: 'liker', referencedColumnName: 'username', foreignKeyConstraintName: 'fk_owner' })
  declare liker: string;
}
