export type SearchResultEntity = 'track' | 'playlist';

export type SearchResult = {
  entity: SearchResultEntity;
  uuid: string;
  title: string;
  /** From `duration` for tracks and `sum_durations` for playlists */
  duration: number;
  artist_name?: string;
};
