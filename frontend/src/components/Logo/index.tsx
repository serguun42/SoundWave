import logoSvg from '../../assets/logo.svg';
import styles from './Logo.module.css';

type Props = {
  className?: string
};

export function Logo({ className }: Props) {
  return (
    <div className={`${styles.container} ${className}`}>
      <img className={styles.img} src={logoSvg} alt="logo" />
      <span className={styles.text}>SoundWave</span>
    </div>
  );
}
