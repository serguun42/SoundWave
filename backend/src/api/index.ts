import { APIMethod, APIMethodParams, APIMethodsStorage } from '../types/api.js';
import { CheckSession, Logout, SignIn, SignUp } from './account.js';
import {
  CreatePlaylist,
  DeletePlaylist,
  GetPlaylistFull,
  GeneratePlaylist,
  LikedPlaylists,
  MarkPlaylistAsLiked,
  MarkPlaylistAsUnliked,
  OwnedPlaylists,
  PlaylistCover,
  PlaylistInfo,
  UpdatePlaylist,
  UpdateTracksInPlaylist,
  UploadPlaylistCover,
} from './playlists.js';
import SearchByText from './search.js';
import {
  CreateTrack,
  DeleteTrack,
  LikedTracks,
  MarkTrackAsLiked,
  MarkTrackAsUnliked,
  OwnedTracks,
  TrackAudio,
  TrackCover,
  TrackInfo,
  TracksByPlaylist,
  UpdateTrackInfo,
  UploadAudio,
  UploadTrackCover,
} from './tracks.js';

const API_METHODS_STORAGE: APIMethodsStorage = {
  account: {
    check: CheckSession,
    signin: SignIn,
    signup: SignUp,
    logout: Logout,
  },
  playlists: {
    owned: OwnedPlaylists,
    liked: LikedPlaylists,
    info: PlaylistInfo,
    cover: PlaylistCover,
    full: GetPlaylistFull,
    generate: GeneratePlaylist,
    updateInfo: UpdatePlaylist,
    updateTracks: UpdateTracksInPlaylist,
    create: CreatePlaylist,
    uploadCover: UploadPlaylistCover,
    delete: DeletePlaylist,
    like: MarkPlaylistAsLiked,
    unlike: MarkPlaylistAsUnliked,
  },
  tracks: {
    owned: OwnedTracks,
    liked: LikedTracks,
    info: TrackInfo,
    cover: TrackCover,
    audio: TrackAudio,
    byPlaylist: TracksByPlaylist,
    updateInfo: UpdateTrackInfo,
    create: CreateTrack,
    uploadAudio: UploadAudio,
    uploadCover: UploadTrackCover,
    delete: DeleteTrack,
    like: MarkTrackAsLiked,
    unlike: MarkTrackAsUnliked,
  },
  search: SearchByText,
};

const SelectMethod = (path: string[]): APIMethod | null => {
  let selected: APIMethod | APIMethodsStorage | null = API_METHODS_STORAGE;

  // eslint-disable-next-line no-restricted-syntax
  for (const pathPart of path) {
    selected = (selected as APIMethodsStorage)[pathPart];
    if (!selected) return null;
  }

  return selected as APIMethod;
};

const RunAPIMethod = (params: APIMethodParams) => {
  /** Remove /api/v0/ */
  const method = SelectMethod(params.path.slice(2));

  if (typeof method !== 'function') {
    params.sendCode(404);
    return;
  }

  method(params);
};

export default RunAPIMethod;
