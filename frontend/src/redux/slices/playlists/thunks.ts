import { createAsyncThunk } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-relative-packages
import { Playlist } from '../../../../../backend/src/types/entities';

export const fetchPlaylistCover = createAsyncThunk<string, string>(
  'playlists/fetchPlaylistCover',
  async payload => {
    const response = await fetch(`/api/v1/playlists/cover?uuid=${payload}`);

    if (!response.ok) return '';
    const data = await response.blob();
    return URL.createObjectURL(data);
  },
);

export const fetchOwnedPlaylists = createAsyncThunk<Playlist[]>(
  'playlists/fetchOwnedPlaylists',
  async (_, { rejectWithValue }) => {
    const response = await fetch('/api/v1/playlists/owned');

    if (!response.ok) {
      return rejectWithValue(await response.text());
    }
    const data = await response.json();
    return data;
  },
);

export const fetchLikedPlaylists = createAsyncThunk<Playlist[]>(
  'playlists/fetchLikedPlaylists',
  async (_, { rejectWithValue }) => {
    const response = await fetch('/api/v1/playlists/liked');

    if (!response.ok) {
      return rejectWithValue(await response.text());
    }
    const data = await response.json();
    return data;
  },
);

export const fetchRecommendPlaylists = createAsyncThunk<Playlist[]>(
  'playlists/fetchRecommendPlaylists',
  async (_, { rejectWithValue }) => {
    const response = await fetch('/api/v1/playlists/recommend');

    if (!response.ok) {
      return rejectWithValue(await response.text());
    }
    const data = await response.json();
    return data;
  },
);
