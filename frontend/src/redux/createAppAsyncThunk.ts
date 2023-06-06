import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AppState, AppDispatch } from './store';

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppState;
  dispatch: AppDispatch;
}>();
