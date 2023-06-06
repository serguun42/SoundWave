import { createAsyncThunk } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-relative-packages
import { Track } from '../../../../../backend/src/types/entities';
import { TrackAudioInfo, TrackWithSrc } from './types';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';

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
    const response = await fetch(`/api/v1/tracks/cover?uuid=${payload}`);

    if (!response.ok) return '';
    const data = await response.blob();
    return URL.createObjectURL(data);
  },
);

export const fetchTrackAudio = createAppAsyncThunk<TrackAudioInfo | undefined, string>(
  'tracks/fetchTrackAudio',
  async (payload, { dispatch, getState }) => {
    const info = await dispatch(fetchTrackInfo(payload)).unwrap();
    const cover = await dispatch(fetchTrackCover(payload)).unwrap();

    const state = getState();
    const isLikedSelector = (uuid: string) => {
      for (const track of state.tracks.likedTracks) {
        if (track.uuid === uuid) {
          return true;
        }
      }
      return false;
    };
    const isLiked = isLikedSelector(payload);

    return { src: `/api/v1/tracks/audio?uuid=${payload}`, coverSrc: cover, isLiked, ...info };
  },
);

export const fetchLikedTracks = createAsyncThunk<TrackWithSrc[]>(
  'tracks/fetchLikedTracks',
  async (_, { dispatch, rejectWithValue }) => {
    const response = await fetch('/api/v1/tracks/liked');

    if (!response.ok) {
      return rejectWithValue(await response.text());
    }
    const data: Track[] = await response.json();
    const tracksWithSrc = await Promise.all(data.map(async item => {
      const cover = await dispatch(fetchTrackCover(item.uuid)).unwrap();
      return { ...item, imgSrc: cover };
    }));
    return tracksWithSrc;
  },
);

export const fetchTracksByPlaylist = createAsyncThunk<TrackWithSrc[], string>(
  'tracks/fetchTracksByPlaylist',
  async (payload, { dispatch, rejectWithValue }) => {
    const response = await fetch(`/api/v1/tracks/byPlaylist?uuid=${payload}`);

    if (!response.ok) {
      return rejectWithValue(await response.text());
    }
    const data: Track[] = await response.json();
    const tracksWithSrc = await Promise.all(data.map(async item => {
      const cover = await dispatch(fetchTrackCover(item.uuid)).unwrap();
      return { ...item, imgSrc: cover };
    }));
    return tracksWithSrc;
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

export const downloadTrack = createAsyncThunk<undefined, string>(
  'tracks/downloadTrack',
  async payload => {
    const response = await fetch(`/api/v1/tracks/audio?uuid=${payload}`);

    if (payload) {
      const blob = await response.blob();
      const link = document.createElement('a');
      link.download = 'track';
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    }

    return undefined;
  },
);
