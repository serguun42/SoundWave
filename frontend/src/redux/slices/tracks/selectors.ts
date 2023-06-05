import { AppState } from '../../store';

export const likedTracksSelector = (state: AppState) => state.tracks.likedTracks;
export const isTrackLikedSelector = (uuid: string) => (state: AppState) => {
  for (const track of state.tracks.likedTracks) {
    if (track.uuid === uuid) {
      return true;
    }
  }
  return false;
};
