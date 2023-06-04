import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SelectedTab } from './types';
import { check, login, register } from './thunks';

const initialState = {
  selectedTab: SelectedTab.left,
  isLoading: false,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSelectedTab(state, action: PayloadAction<SelectedTab>) {
      state.selectedTab = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(check.pending, state => {
        state.isLoading = true;
      })
      .addCase(check.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(check.rejected, state => {
        state.isLoading = false;
      })
      .addCase(login.pending, state => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(login.rejected, state => {
        state.isLoading = false;
      })
      .addCase(register.pending, state => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(register.rejected, state => {
        state.isLoading = false;
      });
  },
});

export const {
  setSelectedTab,
} = slice.actions;

export default slice.reducer;
