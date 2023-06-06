import { AppState } from '../../store';

export const isTrackPlayingSelector = (state: AppState) => state.tracks.isPlaying;
export const isUuidLoadingSelector = (state: AppState) => state.tracks.isUuidLoading;
export const playingInfoSelector = (state: AppState) => state.tracks.playingInfo;
export const likedTracksSelector = (state: AppState) => state.tracks.likedTracks;
export const isTrackLikedSelector = (uuid: string) => (state: AppState) => {
  for (const track of state.tracks.likedTracks) {
    if (track.uuid === uuid) {
      return true;
    }
  }
  return false;
};
