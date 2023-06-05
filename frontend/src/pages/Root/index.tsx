import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { fetchLikedTracks } from '../../redux/slices/tracks/thunks';
import { isCookieExists } from '../../helpers';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { Player } from './components/Player';
import styles from './Root.module.css';

export function Root() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isCookieExists('session_token')) {
      navigate('/auth');
    }
    dispatch(fetchLikedTracks());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={styles.wrapper}>
        <Navbar />
        <div className={styles.content_wrapper}>
          <Header />
          <main>
            <Outlet />
          </main>
        </div>
      </div>
      <Player />
    </>
  );
}
