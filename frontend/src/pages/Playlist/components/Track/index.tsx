import { useState } from 'react';
import { useSelector } from 'react-redux';
import { isTrackLikedSelector } from '../../../../redux/slices/tracks/selectors';
// eslint-disable-next-line import/no-relative-packages
import { Track as TrackType } from '../../../../../../backend/src/types/entities';
import { useAppDispatch } from '../../../../hooks/redux';
import { markTrackAsLiked, markTrackAsUnliked } from '../../../../redux/slices/tracks/thunks';
import { convertSecondsToString } from '../../../../helpers';
import playSvg from '../../../../assets/player/play.svg';
import heartFillSvg from '../../../../assets/player/heart_fill.svg';
import heartOutlineSvg from '../../../../assets/player/heart_outline.svg';
import styles from './Track.module.css';

type Props = Omit<TrackType, 'owner' | 'mime_type'> & { position: number, imgSrc?: string };

export function Track({ position, uuid, duration, title, artist_name: artistName, imgSrc }: Props) {
  const dispatch = useAppDispatch();

  const [isHover, setIsHover] = useState(false);
  const isTrackLiked = useSelector(isTrackLikedSelector(uuid));
  const [isLiked, setisLiked] = useState(isTrackLiked);

  const onMouseEnter = () => {
    setIsHover(true);
  };

  const onMouseLeave = () => {
    setIsHover(false);
  };

  const onLikeClick = () => {
    dispatch(markTrackAsLiked(uuid));
    setisLiked(true);
  };

  const onUnlikeClick = () => {
    dispatch(markTrackAsUnliked(uuid));
    setisLiked(false);
  };

  return (
    <div className={styles.container} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className={styles.position_container}>
        {isHover ? <img src={playSvg} alt="" /> : position}
      </div>
      <div className={styles.cover_container}>
        <img className={styles.cover} src={imgSrc} alt="" />
      </div>
      <div className={styles.title_container}>
        <h3>{title}</h3>
        <span>{artistName}</span>
      </div>
      {isLiked ?
        <img className={styles.like} src={heartFillSvg} alt="" onClick={onUnlikeClick} /> :
        <img className={styles.like} src={heartOutlineSvg} alt="" onClick={onLikeClick} />}
      <span className={styles.time}>{convertSecondsToString(duration)}</span>
    </div>
  );
}
