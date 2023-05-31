import styles from './HistoryArrows.module.css';

export function HistoryArrows() {
  const left = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_37_490)">
        <path d="M15 6L9 12L15 18" stroke="#8F9397" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_37_490">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );

  const right = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_37_491)">
        <path d="M9 6L15 12L9 18" stroke="#8F9397" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_37_491">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );

  const onLeftClick = () => {
    window.history.back();
  };

  const onRightClick = () => {
    window.history.forward();
  };

  return (
    <div className={styles.container}>
      <div className={styles.arrow} onClick={onLeftClick}>{left}</div>
      <div className={styles.arrow} onClick={onRightClick}>{right}</div>
    </div>
  );
}
