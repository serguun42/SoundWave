import { CheckSession, Logout, SignIn, SignUp } from './account.js';
import {
  CreatePlaylist,
  DeletePlaylist,
  FullPlaylist,
  PlaylistInfo,
  UpdatePlaylist,
  UpdateTracksInPlaylist,
} from './playlists.js';

/** @type {import('../types/api').APIMethodsStorage} */
const API_METHODS_STORAGE = {
  account: {
    check: CheckSession,
    signin: SignIn,
    signup: SignUp,
    logout: Logout,
  },
  playlist: {
    info: PlaylistInfo,
    full: FullPlaylist,
    updateInfo: UpdatePlaylist,
    updateTracks: UpdateTracksInPlaylist,
    create: CreatePlaylist,
    delete: DeletePlaylist,
  },
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
  const method = SelectMethod(params.path.slice(2));

  if (typeof method !== 'function') {
    params.sendCode(404);
    return;
  }

  method(params);
};

export default RunAPIMethod;
