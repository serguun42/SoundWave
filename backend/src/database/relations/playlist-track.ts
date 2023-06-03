import { Entity, Column, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { PlaylistTrackRelation } from '../../types/db.js';
import PlaylistModel from '../models/playlist.js';
import TrackModel from '../models/track.js';

@Entity('playlists_tracks')
@Unique('playlist_track_unique', ['playlist_uuid', 'track_uuid'])
@Unique('track_unique_position', ['playlist_uuid', 'position'])
export default class PlaylistTrackModel implements PlaylistTrackRelation {
  @ManyToOne(() => PlaylistModel, (playlist) => playlist.playlistTracks)
  @JoinColumn({ name: 'playlist_uuid', referencedColumnName: 'uuid', foreignKeyConstraintName: 'fk_playlist_uuid' })
  declare playlist_uuid: string;

  @ManyToOne(() => TrackModel, (track) => track.trackPlaylists)
  @JoinColumn({ name: 'track_uuid', referencedColumnName: 'uuid', foreignKeyConstraintName: 'fk_track_uuid' })
  declare track_uuid: string;

  @Column({ type: 'integer', unique: true, default: 0 })
  declare position: number;
}
