import { Op } from 'sequelize';
import LogMessageOrError from '../util/log.js';
import { UnwrapMany, UnwrapOne } from '../util/unwrap-model.js';
import sequelizeConnection from './connection.js';
import {
  UserModel,
  SessionModel,
  TrackModel,
  PlaylistModel,
  PlaylistTrackModel,
  TrackLikeModel,
  PlaylistLikeModel,
} from './models.js';
import { User, Session, Track, Playlist, PlaylistFull, PlaylistSavingPositions } from '../types/entities.js';
import { PlaylistTrackRelation } from '../types/db.js';

export const GetUser = (username: string) => UserModel.findOne({ where: { username } }).then(UnwrapOne);

export const AddUser = (user: User) => UserModel.create(user).then(UnwrapOne);

export const UpdateUser = (username: string, userData: Partial<User>) =>
  UserModel.update(userData, { where: { username } });

export const GetSession = (sessionToken: string) =>
  SessionModel.findOne({ where: { session_token: sessionToken } }).then(UnwrapOne);

export const GetUserBySession = (sessionToken: string) =>
  SessionModel.findOne({
    where: { session_token: sessionToken },
    include: [SessionModel.associations.session_to_user],
  }).then((sessionWithUser) => {
    if (!sessionWithUser) return Promise.resolve(null);

    return UnwrapOne(sessionWithUser.session_to_user);
  });

export const AddSession = (session: Session) => SessionModel.create(session).then(UnwrapOne);

export const DeleteSession = (sessionToken: string) => SessionModel.destroy({ where: { session_token: sessionToken } });

export const GetTrack = (uuid: string) => TrackModel.findOne({ where: { uuid } }).then(UnwrapOne);

export const SearchTracksByRegexp = (rx: string) =>
  TrackModel.findAll({
    where: {
      [Op.or]: [{ title: { [Op.iRegexp]: rx } }, { artist_name: { [Op.iRegexp]: rx } }],
    },
    limit: 10,
  }).then(UnwrapMany);

export const AddTrack = (track: Partial<Track>) => TrackModel.create(track as Track).then(UnwrapOne);

export const UpdateTrack = (trackUUID: string, trackData: Partial<Track>) =>
  TrackModel.update(trackData, { where: { uuid: trackUUID } });

export const RemoveTrack = (trackUUID: string) => TrackModel.destroy({ where: { uuid: trackUUID } });

export const FindOwnedTracks = (owner: string, offset = 0, limit = 100) =>
  TrackModel.findAll({ where: { owner }, limit, offset }).then(UnwrapMany);

export const GetPlaylistInfo = (uuid: string) => PlaylistModel.findOne({ where: { uuid } }).then(UnwrapOne);

export const SearchPlaylistsByRegexp = (rx: string) =>
  PlaylistModel.findAll({
    where: {
      title: { [Op.iRegexp]: rx },
    },
    limit: 10,
  }).then(UnwrapMany);

export const AddPlaylistInfo = (playlistInfo: Partial<Playlist>) =>
  PlaylistModel.create(playlistInfo as Playlist).then(UnwrapOne);

export const UpdatePlaylistInfo = (playlistUUID: string, playlistInfo: Partial<Playlist>) =>
  PlaylistModel.update(playlistInfo, { where: { uuid: playlistUUID } });

export const RemovePlaylist = (playlistUUID: string) => PlaylistModel.destroy({ where: { uuid: playlistUUID } });

export const GetFullPlaylist = (playlistUUID: string) =>
  PlaylistModel.findOne({
    where: { uuid: playlistUUID },
    include: [PlaylistModel.associations.tracks_in_playlist],
    order: [
      [
        PlaylistModel.associations.tracks_in_playlist,
        PlaylistModel.associations.positions_of_tracks_in_playlist,
        'position',
        'ASC',
      ],
    ],
  }).then((fullPlaylistFromDB) => {
    if (!fullPlaylistFromDB) return Promise.resolve(null);

    const fullPlaylist = {
      ...UnwrapOne(fullPlaylistFromDB),
      tracks_in_playlist: UnwrapMany<Partial<Track & { playlists_tracks: PlaylistTrackRelation }>>(
        fullPlaylistFromDB?.tracks_in_playlist
      )
        .sort((prev, next) => (prev.playlists_tracks?.position || 0) - (next.playlists_tracks?.position || 0))
        .map((trackInPlaylist) => {
          delete trackInPlaylist.playlists_tracks;
          return trackInPlaylist;
        }),
    };

    return Promise.resolve(fullPlaylist as PlaylistFull);
  });

export const GetTracksByPlaylist = (playlistUUID: string): Promise<Track[]> =>
  PlaylistTrackModel.findAll({
    where: { playlist_uuid: playlistUUID },
    include: PlaylistTrackModel.associations.tracks_by_playlist,
    order: [['position', 'ASC']],
  }).then(
    (tracksByPlaylist) =>
      tracksByPlaylist
        .sort((prev, next) => prev.position - next.position)
        .map((trackByPlaylist) => UnwrapOne(trackByPlaylist.tracks_by_playlist))
        .filter(Boolean) as Track[]
  );

export const GetRandomTracks = (limit: number) =>
  TrackModel.findAll({ limit, order: sequelizeConnection.random() }).then(UnwrapMany);

export const SaveTracksByPlaylist = (savingPositions: PlaylistSavingPositions) =>
  sequelizeConnection.transaction().then((transaction) =>
    PlaylistTrackModel.destroy({ where: { playlist_uuid: savingPositions.uuid }, transaction })
      .then(() =>
        PlaylistTrackModel.bulkCreate(
          savingPositions.positions.map((trackUUID, position) => ({
            playlist_uuid: savingPositions.uuid,
            track_uuid: trackUUID,
            position,
          })),
          { transaction }
        )
      )
      .then(() => transaction.commit())
      .catch((e) => {
        LogMessageOrError('SaveTracksByPlaylist transaction rollback:', e);
        return transaction.rollback().then(() => Promise.reject(e));
      })
  );

export const RemoveTrackFromAllPlaylists = (trackUUID: string) =>
  PlaylistTrackModel.destroy({ where: { track_uuid: trackUUID } });

export const RemoveAllTracksFromPlaylist = (playlistUUID: string) =>
  PlaylistTrackModel.destroy({ where: { playlist_uuid: playlistUUID } });

export const FindOwnedPlaylists = (owner: string, offset = 0, limit = 100) =>
  PlaylistModel.findAll({ where: { owner }, limit, offset }).then(UnwrapMany);

export const FindLikedTracks = (liker: string, offset = 0, limit = 100) =>
  TrackLikeModel.findAll({
    where: { liker },
    limit,
    offset,
    include: TrackLikeModel.associations.like_to_track,
  })
    .then((likedTracks) => likedTracks.map((likedTrack) => likedTrack.like_to_track as TrackModel))
    .then(UnwrapMany);

/** Checks whether track is liked yet */
export const IsTrackLiked = (liker: string, trackUUID: string) =>
  TrackLikeModel.findOne({
    where: { liker, track_uuid: trackUUID },
  }).then((trackLike) => {
    if (UnwrapOne(trackLike)?.liker === liker) return Promise.resolve(true);
    return Promise.resolve(false);
  });

export const LikeTrack = (liker: string, trackUUID: string) =>
  TrackLikeModel.create({ liker, track_uuid: trackUUID }).then(UnwrapOne);

export const UnlikeTrack = (liker: string, trackUUID: string) =>
  TrackLikeModel.destroy({ where: { liker, track_uuid: trackUUID } });

export const UnlikeTrackForEveryone = (trackUUID: string) =>
  TrackLikeModel.destroy({ where: { track_uuid: trackUUID } });

export const FindLikedPlaylists = (liker: string, offset = 0, limit = 100) =>
  PlaylistLikeModel.findAll({
    where: { liker },
    limit,
    offset,
    include: PlaylistLikeModel.associations.like_to_playlist,
  })
    .then((likedPlaylists) => likedPlaylists.map((likedPlaylist) => likedPlaylist.like_to_playlist as PlaylistModel))
    .then(UnwrapMany);

/** Checks whether playlist is liked yet */
export const IsPlaylistLiked = (liker: string, playlistUUID: string) =>
  PlaylistLikeModel.findOne({
    where: { liker, playlist_uuid: playlistUUID },
  }).then((playlistLike) => {
    if (UnwrapOne(playlistLike)?.liker === liker) return Promise.resolve(true);
    return Promise.resolve(false);
  });

export const LikePlaylist = (liker: string, playlistUUID: string) =>
  PlaylistLikeModel.create({ liker, playlist_uuid: playlistUUID }).then(UnwrapOne);

export const UnlikePlaylist = (liker: string, playlistUUID: string) =>
  PlaylistLikeModel.destroy({ where: { liker, playlist_uuid: playlistUUID } });

export const UnlikePlaylistForEveryone = (playlistUUID: string) =>
  PlaylistLikeModel.destroy({ where: { playlist_uuid: playlistUUID } });
