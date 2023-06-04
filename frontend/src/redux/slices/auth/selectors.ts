import { AppState } from '../../store';

export const selectedTabSelector = (state: AppState) => state.auth.selectedTab;
export const isAuthLoadingSelector = (state: AppState) => state.auth.isLoading;
