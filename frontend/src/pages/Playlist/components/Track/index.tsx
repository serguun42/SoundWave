import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  isTrackLikedSelector,
  isTrackPlayingSelector,
  playingInfoSelector,
} from '../../../../redux/slices/tracks/selectors';
// eslint-disable-next-line import/no-relative-packages
import { Track as TrackType } from '../../../../../../backend/src/types/entities';
import { useAppDispatch } from '../../../../hooks/redux';
import { fetchTrackAudio, markTrackAsLiked, markTrackAsUnliked } from '../../../../redux/slices/tracks/thunks';
import { convertSecondsToString } from '../../../../helpers';
import playSvg from '../../../../assets/player/play.svg';
import pauseSvg from '../../../../assets/player/pause.svg';
import heartFillSvg from '../../../../assets/player/heart_fill.svg';
import heartOutlineSvg from '../../../../assets/player/heart_outline.svg';
import styles from './Track.module.css';
import { setIsPlaying } from '../../../../redux/slices/tracks';

export type TrackProps = Omit<TrackType, 'owner' | 'mime_type'> & { position: number, imgSrc?: string };

export function Track({ position, uuid, duration, title, artist_name: artistName, imgSrc }: TrackProps) {
  const dispatch = useAppDispatch();

  const isTrackLiked = useSelector(isTrackLikedSelector(uuid));
  const isPlaying = useSelector(isTrackPlayingSelector);
  const playingInfo = useSelector(playingInfoSelector);
  const [isHover, setIsHover] = useState(false);

  const onMouseEnter = () => {
    setIsHover(true);
  };

  const onMouseLeave = () => {
    setIsHover(false);
  };

  const onPlayClick = async () => {
    if (uuid === playingInfo.uuid) {
      dispatch(setIsPlaying(true));
    } else {
      dispatch(setIsPlaying(false));
      await dispatch(fetchTrackAudio(uuid));
      dispatch(setIsPlaying(true));
    }
  };

  const onPauseClick = () => {
    dispatch(setIsPlaying(false));
  };

  const onLikeClick = () => {
    dispatch(markTrackAsLiked(uuid));
  };

  const onUnlikeClick = () => {
    dispatch(markTrackAsUnliked(uuid));
  };

  const getPlayButton = () => {
    if (uuid === playingInfo.uuid && isPlaying) {
      return <img src={pauseSvg} alt="" onClick={onPauseClick} />;
    }
    if (isHover) {
      return <img src={playSvg} alt="" onClick={onPlayClick} />;
    }
    return position;
  };

  return (
    <div className={styles.container} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className={styles.position_container}>
        {getPlayButton()}
      </div>
      <div className={styles.cover_container}>
        <img className={styles.cover} src={imgSrc} alt="" />
      </div>
      <div className={styles.title_container}>
        <h3>{title}</h3>
        <span>{artistName}</span>
      </div>
      {isTrackLiked ?
        <img className={styles.like} src={heartFillSvg} alt="" onClick={onUnlikeClick} /> :
        <img className={styles.like} src={heartOutlineSvg} alt="" onClick={onLikeClick} />}
      <span className={styles.time}>{convertSecondsToString(duration)}</span>
    </div>
  );
}
