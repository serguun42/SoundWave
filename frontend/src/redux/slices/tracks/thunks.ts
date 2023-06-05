import { createAsyncThunk } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-relative-packages
import { Track } from '../../../../../backend/src/types/entities';

export const fetchTrackInfo = createAsyncThunk<Track, string>(
  'tracks/fetchTrackInfo',
  async (payload, { rejectWithValue }) => {
    const response = await fetch(`/api/v1/tracks/info?uuid=${payload}`);

    if (!response.ok) {
      return rejectWithValue(await response.text());
    }
    const data = await response.json();
    return data;
  },
);

export const fetchTrackCover = createAsyncThunk<string, string>(
  'tracks/fetchTrackCover',
  async payload => {
    console.log(2313);
    const response = await fetch(`/api/v1/tracks/cover?uuid=${payload}`);
    const data = await response.blob();
    return URL.createObjectURL(data);
  },
);

export const fetchLikedTracks = createAsyncThunk<Track[]>(
  'tracks/fetchLikedTracks',
  async () => {
    const response = await fetch('/api/v1/tracks/liked');
    const data = await response.json();
    return data;
  },
);

export const markTrackAsLiked = createAsyncThunk<Track, string>(
  'tracks/markTrackAsLiked',
  async (payload, { dispatch, rejectWithValue }) => {
    const response = await fetch('/api/v1/tracks/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ uuid: payload }),
    });

    if (!response.ok) {
      return rejectWithValue(await response.text());
    }
    const trackInfo = await dispatch(fetchTrackInfo(payload)).unwrap();
    return trackInfo;
  },
);

export const markTrackAsUnliked = createAsyncThunk<string, string>(
  'tracks/markTrackAsUnliked',
  async (payload, { rejectWithValue }) => {
    const response = await fetch('/api/v1/tracks/unlike', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ uuid: payload }),
    });

    if (!response.ok) {
      return rejectWithValue(await response.text());
    }
    return payload;
  },
);
