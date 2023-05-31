import { useRef } from 'react';
import { HistoryArrows } from '../HistoryArrows';
import { Avatar } from '../Avatar';
import searchSvg from '../../../../assets/header/search.svg';
import styles from './Header.module.css';

export function Header() {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const onSearchClick = () => {
    searchInputRef.current?.focus();
  };

  return (
    <header className={styles.container}>
      <HistoryArrows />
      <div className={styles.search_container} onClick={onSearchClick}>
        <img src={searchSvg} alt="search" />
        <input ref={searchInputRef} type="text" placeholder="Search" />
      </div>
      <Avatar />
    </header>
  );
}
