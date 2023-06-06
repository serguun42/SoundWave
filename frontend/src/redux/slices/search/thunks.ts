/* eslint-disable import/no-relative-packages */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { SearchResult } from '../../../../../backend/src/types/entities';
import { fetchTrackCover } from '../tracks/thunks';
import { fetchPlaylistCover } from '../playlists/thunks';
import { SearchResultWithSrc } from './types';

export const fetchSearch = createAsyncThunk<SearchResultWithSrc[], string>(
  'search/fetchSearch',
  async (payload, { dispatch }) => {
    const response = await fetch(`/api/v1/search?text=${payload}`);

    if (!response.ok) return [];
    const data: SearchResult[] = await response.json();
    const result = await Promise.all(data.map(async item => {
      let src = '';
      if (item.entity === 'track') {
        src = await dispatch(fetchTrackCover(item.uuid)).unwrap();
      } else {
        src = await dispatch(fetchPlaylistCover(item.uuid)).unwrap();
      }
      return { ...item, imgSrc: src };
    }));
    return result;
  },
);
