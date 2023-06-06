// eslint-disable-next-line import/no-relative-packages
import { SearchResult } from '../../../../../backend/src/types/entities';

export type SearchResultWithSrc = SearchResult & { imgSrc: string };

export type SearchState = {
  results: SearchResultWithSrc[];
};
