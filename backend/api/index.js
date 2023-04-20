import { CheckSession, Logout, SignIn, SignUp } from './account.js';
import {
  CreatePlaylist,
  DeletePlaylist,
  FullPlaylist,
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

/** @type {import('../types/api').APIMethodsStorage} */
const API_METHODS_STORAGE = {
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
    full: FullPlaylist,
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

/**
 * @param {string[]} path
 * @returns {import('../types/api').APIMethod | null}
 */
const SelectMethod = (path) => {
  let selected = API_METHODS_STORAGE;

  // eslint-disable-next-line no-restricted-syntax
  for (const part of path) {
    selected = selected[part];
    if (!selected) return null;
  }

  return selected;
};

/** @type {import('../types/api').APIMethod} */
const RunAPIMethod = (params) => {
  /** Remove /api/v0/ */
  const method = SelectMethod(params.path.slice(2));

  if (typeof method !== 'function') {
    params.sendCode(404);
    return;
  }

  method(params);
};

export default RunAPIMethod;
