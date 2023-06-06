// eslint-disable-next-line import/no-relative-packages
import { Track } from '../../../../../backend/src/types/entities';

export type TrackAudioInfo = Omit<Track, 'mime_type' | 'owner'> & { src: string, coverSrc: string, isLiked: boolean };

export type TrackWithSrc = Track & { imgSrc: string };

export type TracksState = {
  isLoading: boolean;
  isPlaying: boolean;
  isUuidLoading: boolean;
  playingInfo: TrackAudioInfo;
  currentTracks: TrackWithSrc[];
  likedTracks: Track[];
};
