// eslint-disable-next-line import/no-relative-packages
import { Track } from '../../../../../backend/src/types/entities';

export type TracksState = {
  isLoading: boolean;
  likedTracks: Track[];
  currentTracks: Track[];
};
