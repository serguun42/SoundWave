import { createSelector } from '@reduxjs/toolkit';
import { AppState } from '../../store';

export const isTrackPlayingSelector = (state: AppState) => state.tracks.isPlaying;
export const isUuidLoadingSelector = (state: AppState) => state.tracks.isUuidLoading;
export const playingInfoSelector = (state: AppState) => state.tracks.playingInfo;
export const currentTracksSelector = (state: AppState) => state.tracks.currentTracks;
export const likedTracksSelector = (state: AppState) => state.tracks.likedTracks;
export const isTrackLikedSelector = (uuid: string) => (state: AppState) => {
  for (const track of state.tracks.likedTracks) {
    if (track.uuid === uuid) {
      return true;
    }
  }
  return false;
};

export const currentTrackPositionSelector = (state: AppState) => {
  const tracks = state.tracks.currentTracks;
  for (let i = 0; i < tracks.length; i++) {
    if (tracks[i].uuid === state.tracks.playingInfo.uuid) {
      return i + 1;
    }
  }
  return -1;
};

export const canSkipPreviousSelector = createSelector(
  currentTrackPositionSelector,
  position => position > 1,
);

export const canSkipNextSelector = createSelector(
  currentTrackPositionSelector,
  currentTracksSelector,
  (position, tracks) => position < tracks.length,
);
