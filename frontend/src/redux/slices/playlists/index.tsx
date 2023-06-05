import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PlaylistsState } from './types';
import { fetchOwnedPlaylists, fetchLikedPlaylists, fetchRecommendPlaylists } from './thunks';

const initialState: PlaylistsState = {
  ownedPlaylists: undefined,
  likedPlaylists: undefined,
  recommendPlaylists: undefined,
};

const slice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchOwnedPlaylists.fulfilled, (state, action) => {
        state.ownedPlaylists = action.payload;
      })
      .addCase(fetchLikedPlaylists.fulfilled, (state, action) => {
        state.likedPlaylists = action.payload;
      })
      .addCase(fetchRecommendPlaylists.fulfilled, (state, action) => {
        state.recommendPlaylists = action.payload;
      });
  },
});

// export const {
// } = slice.actions;

export default slice.reducer;
