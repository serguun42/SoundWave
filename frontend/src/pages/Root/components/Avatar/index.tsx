import defaultPng from '../../../../assets/header/default_avatar.png';
import styles from './Avatar.module.css';

export function Avatar() {
  const arrow = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_37_492)">
        <path d="M6 9L12 15L18 9" stroke="#8F9397" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_37_492">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );

  return (
    <div className={styles.container}>
      <img src={defaultPng} alt="Avatar" />
      <div className={styles.arrow}>{arrow}</div>
    </div>
  );
}
