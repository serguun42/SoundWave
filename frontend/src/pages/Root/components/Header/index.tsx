import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HistoryArrows } from '../HistoryArrows';
import { Avatar } from '../Avatar';
import searchSvg from '../../../../assets/header/search.svg';
import styles from './Header.module.css';
import { useAppDispatch } from '../../../../hooks/redux';
import { searchresultsSelector } from '../../../../redux/slices/search/selectors';
import { fetchSearch } from '../../../../redux/slices/search/thunks';
// eslint-disable-next-line import/no-relative-packages
import { SearchResult } from '../../../../../../backend/src/types/entities';
import { convertSecondsToString } from '../../../../helpers';
import { fetchTrackAudio, fetchTrackInfo } from '../../../../redux/slices/tracks/thunks';

export function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResults = useSelector(searchresultsSelector);
  const [results, setResults] = useState<JSX.Element[]>([]);
  const [isSearchResultsVisibe, setIsSearchResultsVisibe] = useState(false);

  const onSearchClick = () => {
    searchInputRef.current?.focus();
  };

  const onChange = () => {
    if (searchInputRef.current) {
      dispatch(fetchSearch(searchInputRef.current.value));
      if (searchInputRef.current.value === '') {
        setIsSearchResultsVisibe(false);
      }
    }
  };

  const onResultClick = (entity: string, uuid: string) => {
    if (entity === 'track') {
      dispatch(fetchTrackAudio(uuid));
    } else {
      if (searchInputRef.current) {
        searchInputRef.current.value = '';
      }
      setIsSearchResultsVisibe(false);
      navigate(`/playlist/${uuid}`);
    }
  };

  useEffect(() => {
    const items = searchResults.map(item => (
      <div className={styles.search_result} key={item.uuid} onClick={() => onResultClick(item.entity, item.uuid)}>
        <img src={item.imgSrc} alt="" />
        <div className={styles.title_container}>
          <h4>{item.title}</h4>
          <span>{item.entity === 'track' ? item.artist_name : 'Playlist'}</span>
        </div>
        <span className={styles.search_result_time}>{convertSecondsToString(item.duration)}</span>
      </div>
    ));
    setResults(items);
    if (items.length !== 0) {
      setIsSearchResultsVisibe(true);
    } else {
      setIsSearchResultsVisibe(false);
    }
  }, [searchResults]);

  return (
    <header className={styles.container}>
      <HistoryArrows />
      <div className={styles.search_container} onClick={onSearchClick}>
        <img src={searchSvg} alt="search" />
        <input ref={searchInputRef} type="text" placeholder="Search" onChange={onChange} />
        {isSearchResultsVisibe && (
          <div className={styles.search_results_container}>
            {results}
          </div>
        )}
      </div>
      <Avatar />
    </header>
  );
}
