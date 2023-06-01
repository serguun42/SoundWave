import { useState } from 'react';
import styles from './Tabs.module.css';

type Props = {
  className?: string;
  leftText: string;
  rightText: string;
};

export function Tabs({ className, leftText, rightText }: Props) {
  const [selectedTab, setSelectedTab] = useState('left');

  const onLeftTabClick = () => {
    setSelectedTab('left');
  };

  const onRightTabClick = () => {
    setSelectedTab('right');
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <section className={`${styles.container} ${selectedTab === 'right' ? styles.right_tab_selected : ''}`}>
        <button className={styles.button} onClick={onLeftTabClick}>
          <span>{leftText}</span>
        </button>
        <button className={styles.button} onClick={onRightTabClick}>
          <span>{rightText}</span>
        </button>
      </section>
    </div>
  );
}
