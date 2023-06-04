import { ILike } from 'typeorm';
import LogMessageOrError from '../util/log.js';
import REPOSITORY from './repository.js';
import dataSourceConnection from './connection.js';
import PlaylistTrackModel from './relations/playlist-track.js';
import { User, Session, Track, Playlist, PlaylistSavingPositions, PlaylistFull } from '../types/entities.js';

const { UserRepo, SessionRepo, TrackRepo, PlaylistRepo, PlaylistTrackRepo, TrackLikeRepo, PlaylistLikeRepo } =
  REPOSITORY;

export const GetUser = (username: string) => UserRepo.findOne({ where: { username } });

export const AddUser = (user: User) => UserRepo.insert(UserRepo.create(user));

export const UpdateUser = (username: string, userData: Partial<User>) => UserRepo.update({ username }, userData);

export const GetSession = (sessionToken: string) => SessionRepo.findOne({ where: { session_token: sessionToken } });

export const GetUserBySession = (sessionToken: string) =>
  UserRepo.findOne({
    where: {
      sessions: {
        session_token: sessionToken,
      },
    },
    relations: {
      sessions: true,
    },
  });

export const AddSession = (session: Session) => SessionRepo.insert(SessionRepo.create(session));

export const DeleteSession = (sessionToken: string) => SessionRepo.delete({ session_token: sessionToken });

export const GetTrack = (uuid: string) => TrackRepo.findOne({ where: { uuid } });

export const SearchTracksByRegexp = (rx: string) =>
  TrackRepo.find({
    where: [
      {
        title: ILike(`%${rx}%`),
      },
      {
        artist_name: ILike(`%${rx}%`),
      },
    ],
    take: 10,
  });

export const AddTrack = (track: Partial<Track>) =>
  TrackRepo.insert(TrackRepo.create(track)).then((inserted) => {
    const createdUUID = (inserted.identifiers[0] as Partial<Track>)?.uuid;
    if (!createdUUID) return Promise.reject(new Error('Did not create new track'));

    return GetTrack(createdUUID);
  });

export const UpdateTrack = (trackUUID: string, trackData: Partial<Track>) =>
  TrackRepo.update({ uuid: trackUUID }, trackData);

export const RemoveTrack = (trackUUID: string) => TrackRepo.delete({ uuid: trackUUID });

export const FindOwnedTracks = (owner: string, offset = 0, limit = 100) =>
  TrackRepo.find({ where: { owner }, skip: offset, take: limit });

export const GetPlaylistInfo = (uuid: string) => PlaylistRepo.findOne({ where: { uuid } });

export const SearchPlaylistsByRegexp = (rx: string) =>
  PlaylistRepo.find({
    where: {
      title: ILike(`%${rx}%`),
    },
    take: 10,
  });

export const AddPlaylistInfo = (playlistInfo: Partial<Playlist>) =>
  PlaylistRepo.insert(PlaylistRepo.create(playlistInfo)).then((inserted) => {
    const createdUUID = (inserted.identifiers[0] as Partial<Playlist>)?.uuid;
    if (!createdUUID) return Promise.reject(new Error('Did not create new playlist'));

    return GetPlaylistInfo(createdUUID);
  });

export const UpdatePlaylistInfo = (playlistUUID: string, playlistInfo: Partial<Playlist>) =>
  PlaylistRepo.update({ uuid: playlistUUID }, playlistInfo);

export const RemovePlaylist = (playlistUUID: string) => PlaylistRepo.delete({ uuid: playlistUUID });

export const GetFullPlaylist = (playlistUUID: string) =>
  PlaylistRepo.findOne({
    where: { uuid: playlistUUID },
    relations: {
      playlistTracks: {
        track: true,
      },
    },
    order: {
      playlistTracks: {
        position: {
          direction: 'ASC',
        },
      },
    },
  }).then((playlistModelWithTracks) => {
    if (!playlistModelWithTracks) return Promise.resolve(null);

    const fullPlaylist: PlaylistFull = {
      uuid: playlistModelWithTracks.uuid,
      sum_duration: playlistModelWithTracks.sum_duration,
      owner: playlistModelWithTracks.owner,
      title: playlistModelWithTracks.title,
      tracks_in_playlist: playlistModelWithTracks.playlistTracks.map((playlistTrack) => playlistTrack.track),
    };

    return Promise.resolve(fullPlaylist);
  });

export const GetTracksByPlaylist = (playlistUUID: string) =>
  TrackRepo.find({
    where: {
      trackPlaylists: {
        playlist_uuid: playlistUUID,
      },
    },
    order: {
      trackPlaylists: {
        position: 'ASC',
      },
    },
  });

export const GetRandomTracks = (limit: number) =>
  TrackRepo.createQueryBuilder().orderBy('RANDOM()').limit(limit).getMany();

export const SaveTracksByPlaylist = (savingPositions: PlaylistSavingPositions) =>
  dataSourceConnection.manager.transaction('READ COMMITTED', async (manager) => {
    const { queryRunner } = manager;
    if (!queryRunner)
      return Promise.reject(new Error('SaveTracksByPlaylist cannot start transaction without queryRunner'));

    return queryRunner
      .connect()
      .then(() => queryRunner.startTransaction())
      .then(() =>
        queryRunner.manager.delete(PlaylistTrackModel, {
          playlist_uuid: savingPositions.uuid,
        })
      )
      .then(() =>
        queryRunner.manager.save(
          savingPositions.positions.map((trackUUID, position) =>
            queryRunner.manager.create(PlaylistTrackModel, {
              playlist_uuid: savingPositions.uuid,
              track_uuid: trackUUID,
              position,
            })
          )
        )
      )
      .then(() => queryRunner.commitTransaction())
      .catch((e) => {
        LogMessageOrError('SaveTracksByPlaylist transaction rollback:', e);
        return queryRunner.rollbackTransaction().then(() => Promise.reject(e));
      });
  });

export const RemoveTrackFromAllPlaylists = (trackUUID: string) => PlaylistTrackRepo.delete({ track_uuid: trackUUID });

export const RemoveAllTracksFromPlaylist = (playlistUUID: string) =>
  PlaylistTrackRepo.delete({ playlist_uuid: playlistUUID });

export const FindOwnedPlaylists = (owner: string, offset = 0, limit = 100) =>
  PlaylistRepo.find({ where: { owner }, skip: offset, take: limit });

export const FindLikedTracks = (liker: string, offset = 0, limit = 100) =>
  TrackRepo.find({
    where: {
      trackLikes: {
        liker,
      },
    },
    skip: offset,
    take: limit,
  });

export const IsTrackLiked = (liker: string, trackUUID: string) =>
  TrackLikeRepo.findOne({
    where: { liker, track_uuid: trackUUID },
  }).then((trackLike) => {
    if (trackLike?.liker === liker) return Promise.resolve(true);
    return Promise.resolve(false);
  });

export const LikeTrack = (liker: string, trackUUID: string) =>
  TrackLikeRepo.insert(TrackLikeRepo.create({ liker, track_uuid: trackUUID }));

export const UnlikeTrack = (liker: string, trackUUID: string) => TrackLikeRepo.delete({ liker, track_uuid: trackUUID });

export const UnlikeTrackForEveryone = (trackUUID: string) => TrackLikeRepo.delete({ track_uuid: trackUUID });

export const FindLikedPlaylists = (liker: string, offset = 0, limit = 100) =>
  PlaylistRepo.find({
    where: { playlistLikes: { liker } },
    skip: offset,
    take: limit,
  });

export const IsPlaylistLiked = (liker: string, playlistUUID: string) =>
  PlaylistLikeRepo.findOne({
    where: { liker, playlist_uuid: playlistUUID },
  }).then((playlistLike) => {
    if (playlistLike?.liker === liker) return Promise.resolve(true);
    return Promise.resolve(false);
  });

export const LikePlaylist = (liker: string, playlistUUID: string) =>
  PlaylistLikeRepo.insert(PlaylistLikeRepo.create({ liker, playlist_uuid: playlistUUID }));

export const UnlikePlaylist = (liker: string, playlistUUID: string) =>
  PlaylistLikeRepo.delete({ liker, playlist_uuid: playlistUUID });

export const UnlikePlaylistForEveryone = (playlistUUID: string) =>
  PlaylistLikeRepo.delete({ playlist_uuid: playlistUUID });
