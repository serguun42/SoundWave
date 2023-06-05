import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ownedPlaylistsSelector, recommendPlaylistsSelector } from '../../redux/slices/playlists/selectors';
import { useAppDispatch } from '../../hooks/redux';
import { fetchOwnedPlaylists, fetchRecommendPlaylists } from '../../redux/slices/playlists/thunks';
import { Playlists } from '../Playlists';

export function Home() {
  const dispatch = useAppDispatch();

  const recommendPlaylists = useSelector(recommendPlaylistsSelector);
  const ownedPlaylists = useSelector(ownedPlaylistsSelector);

  useEffect(() => {
    dispatch(fetchRecommendPlaylists());
    dispatch(fetchOwnedPlaylists());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {recommendPlaylists && <Playlists title="Trending now" playlists={recommendPlaylists} />}
      {ownedPlaylists && <Playlists title="Your playlists" playlists={ownedPlaylists} />}
    </>
  );
}
