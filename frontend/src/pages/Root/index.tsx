import { Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { Player } from './components/Player';
import styles from './Root.module.css';

export function Root() {
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
