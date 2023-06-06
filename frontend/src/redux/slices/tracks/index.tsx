import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TracksState } from './types';
import {
  fetchTrackCover,
  fetchLikedTracks,
  markTrackAsLiked,
  markTrackAsUnliked,
  fetchTrackAudio,
  fetchTracksByPlaylist,
} from './thunks';
// eslint-disable-next-line import/no-relative-packages

const initialState: TracksState = {
  isLoading: false,
  isPlaying: false,
  isUuidLoading: false,
  playingInfo: { src: '', coverSrc: '', isLiked: false, uuid: '', duration: 0, title: '', artist_name: '' },
  currentTracks: [],
  likedTracks: [],
};

const slice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setIsPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
    clearCurrentTracks(state) {
      state.currentTracks = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTrackCover.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchTrackCover.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(fetchTrackCover.rejected, state => {
        state.isLoading = false;
      })
      .addCase(fetchTrackAudio.pending, state => {
        state.isLoading = true;
        state.isPlaying = false;
      })
      .addCase(fetchTrackAudio.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.playingInfo = action.payload;
          state.isUuidLoading = false;
          state.isPlaying = true;
        }
      })
      .addCase(fetchTrackAudio.rejected, state => {
        state.isLoading = false;
      })
      .addCase(fetchLikedTracks.pending, state => {
        state.isLoading = true;
        state.currentTracks = [];
      })
      .addCase(fetchLikedTracks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTracks = action.payload;
        state.likedTracks = action.payload;
      })
      .addCase(fetchLikedTracks.rejected, state => {
        state.isLoading = false;
      })
      .addCase(fetchTracksByPlaylist.pending, state => {
        state.isLoading = true;
        state.currentTracks = [];
      })
      .addCase(fetchTracksByPlaylist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTracks = action.payload;
      })
      .addCase(markTrackAsLiked.fulfilled, (state, action) => {
        const track = action.payload;
        state.likedTracks = [...state.likedTracks, track];
      })
      .addCase(markTrackAsUnliked.fulfilled, (state, action) => {
        const uuid = action.payload;
        state.likedTracks = state.likedTracks.filter(item => item.uuid !== uuid);
      });
  },
});

export const {
  setIsPlaying,
  clearCurrentTracks,
} = slice.actions;

export default slice.reducer;
