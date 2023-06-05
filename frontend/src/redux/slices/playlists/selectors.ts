import { AppState } from '../../store';

export const ownedPlaylistsSelector = (state: AppState) => state.playlists.ownedPlaylists;
export const likedPlaylistsSelector = (state: AppState) => state.playlists.likedPlaylists;
export const recommendPlaylistsSelector = (state: AppState) => state.playlists.recommendPlaylists;
