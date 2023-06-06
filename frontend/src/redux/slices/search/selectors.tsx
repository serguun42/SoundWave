import { AppState } from '../../store';

export const searchresultsSelector = (state: AppState) => state.search.results;
