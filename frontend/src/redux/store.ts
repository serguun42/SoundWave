import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth';
import tracksReducer from './slices/tracks';
import playlistsReducer from './slices/playlists';
import searchReducer from './slices/search';

const rootReducer = combineReducers({
  auth: authReducer,
  tracks: tracksReducer,
  playlists: playlistsReducer,
  search: searchReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
