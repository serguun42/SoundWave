import { createSlice } from '@reduxjs/toolkit';
import { fetchSearch } from './thunks';
import { SearchState } from './types';

const initialState: SearchState = {
  results: [],
};

const slice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSearch.fulfilled, (state, action) => {
        state.results = action.payload;
      });
  },
});

export default slice.reducer;
