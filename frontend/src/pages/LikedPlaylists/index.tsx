import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { likedPlaylistsSelector } from '../../redux/slices/playlists/selectors';
import { useAppDispatch } from '../../hooks/redux';
import { fetchLikedPlaylists } from '../../redux/slices/playlists/thunks';
import { Playlists } from '../Playlists';

export function LikedPlaylists() {
  const dispatch = useAppDispatch();

  const playlists = useSelector(likedPlaylistsSelector);

  useEffect(() => {
    dispatch(fetchLikedPlaylists());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (playlists) {
    return <Playlists playlists={playlists} />;
  }
  return null;
}
