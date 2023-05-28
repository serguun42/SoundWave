import { Outlet } from 'react-router-dom';
import styles from './Root.module.css';

export function Root() {
  return (
    <div className={styles.content}>
      <div>Root Page</div>

      <Outlet />
    </div>
  );
}
