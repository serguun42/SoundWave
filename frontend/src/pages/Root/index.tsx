import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { isCookieExists } from '../../helpers';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { Player } from './components/Player';
import styles from './Root.module.css';

export function Root() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCookieExists('session_token')) {
      navigate('/auth');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={styles.wrapper}>
        <Navbar />
        <div className={styles.content_wrapper}>
          <Header />
          <main className={styles.main}>
            <Outlet />
          </main>
        </div>
      </div>
      <Player />
    </>
  );
}
