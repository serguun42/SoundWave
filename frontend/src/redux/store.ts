import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth';

const rootReducer = combineReducers({
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
