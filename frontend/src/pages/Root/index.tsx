import { Outlet } from 'react-router-dom';
import styles from './Root.module.css';
import { Navbar } from './components/Navbar';

export function Root() {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <main className={styles.outlet_wrapper}>
        <Outlet />
      </main>
    </div>
  );
}
