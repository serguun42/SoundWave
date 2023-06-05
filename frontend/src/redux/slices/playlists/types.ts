// eslint-disable-next-line import/no-relative-packages
import { Playlist } from '../../../../../backend/src/types/entities';

export type PlaylistsState = {
  ownedPlaylists: Playlist[] | undefined;
  likedPlaylists: Playlist[] | undefined;
  recommendPlaylists: Playlist[] | undefined;
};
