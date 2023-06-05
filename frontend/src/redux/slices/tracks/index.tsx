import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TracksState } from './types';
import { fetchTrackCover, fetchLikedTracks, markTrackAsLiked, markTrackAsUnliked } from './thunks';
// eslint-disable-next-line import/no-relative-packages

const initialState: TracksState = {
  isLoading: false,
  likedTracks: [],
  currentTracks: [],
};

const slice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {},
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
      .addCase(fetchLikedTracks.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchLikedTracks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.likedTracks = action.payload;
      })
      .addCase(fetchLikedTracks.rejected, state => {
        state.isLoading = false;
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

// export const {
//   isTrackLiked,
// } = slice.actions;

export default slice.reducer;
