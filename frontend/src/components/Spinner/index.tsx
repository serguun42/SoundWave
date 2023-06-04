import { useSelector } from 'react-redux';
import { isAuthLoadingSelector } from '../../redux/slices/auth/selectors';
import styles from './Spinner.module.css';

export function Spinner() {
  const isLoading = useSelector(isAuthLoadingSelector);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.spinner} />
      </div>
    );
  }
  return null;
}
