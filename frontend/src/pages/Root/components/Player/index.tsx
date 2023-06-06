/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import heartFillSvg from '../../../../assets/player/heart_fill.svg';
import heartOutlineSvg from '../../../../assets/player/heart_outline.svg';
import playSvg from '../../../../assets/player/play.svg';
import pauseSvg from '../../../../assets/player/pause.svg';
import skipPreviousSvg from '../../../../assets/player/skip_previous.svg';
import skipNextSvg from '../../../../assets/player/skip_next.svg';
import volumeMuteSvg from '../../../../assets/player/volume_mute.svg';
import volumeLowSvg from '../../../../assets/player/volume_low.svg';
import volumeHighSvg from '../../../../assets/player/volume_high.svg';
import downloadSvg from '../../../../assets/player/download.svg';
import styles from './Player.module.css';
import { useAppDispatch } from '../../../../hooks/redux';
import {
  downloadTrack,
  fetchTrackAudio,
  markTrackAsLiked,
  markTrackAsUnliked,
} from '../../../../redux/slices/tracks/thunks';
import {
  canSkipNextSelector,
  canSkipPreviousSelector,
  currentTracksSelector,
  isTrackPlayingSelector,
  playingInfoSelector,
} from '../../../../redux/slices/tracks/selectors';
import { setIsPlaying } from '../../../../redux/slices/tracks';
import { convertSecondsToString } from '../../../../helpers';

export function Player() {
  const dispatch = useAppDispatch();

  const playingInfo = useSelector(playingInfoSelector);
  const isPlaying = useSelector(isTrackPlayingSelector);
  const canSkipPrevious = useSelector(canSkipPreviousSelector);
  const canSkipNext = useSelector(canSkipNextSelector);
  const currentTracks = useSelector(currentTracksSelector);

  const audioRef = useRef<HTMLAudioElement>(null);
  const timelineActiveRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLInputElement>(null);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [isLiked, setIsLiked] = useState(false);
  const [isVolumeHover, setIsVolumeHover] = useState(false);
  const [volumeImage, setVolumeImage] = useState<string>(volumeLowSvg);

  const onTimeUpdate = () => {
    if (audioRef.current && timelineActiveRef.current) {
      const { currentTime } = audioRef.current;
      setCurrentTime(convertSecondsToString(currentTime));
      timelineActiveRef.current.style.width = `${(currentTime / playingInfo.duration) * 100}%`;
    }
  };

  useEffect(() => {
    setIsLiked(playingInfo.isLiked);
  }, [playingInfo.isLiked]);

  const onLikeClick = () => {
    dispatch(markTrackAsLiked(playingInfo.uuid));
    setIsLiked(true);
  };

  const onUnlikeClick = () => {
    dispatch(markTrackAsUnliked(playingInfo.uuid));
    setIsLiked(false);
  };

  const onDownloadTrack = () => {
    dispatch(downloadTrack(playingInfo.uuid));
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  const onPlayClick = () => {
    if (isPlaying) {
      dispatch(setIsPlaying(false));
    } else {
      dispatch(setIsPlaying(true));
    }
  };

  const onSkipPrevious = () => {
    if (canSkipPrevious) {
      for (let i = 0; i < currentTracks.length; i++) {
        if (playingInfo.uuid === currentTracks[i].uuid) {
          dispatch(fetchTrackAudio(currentTracks[i - 1].uuid));
        }
      }
    }
  };

  const onSkipNext = () => {
    if (canSkipNext) {
      for (let i = 0; i < currentTracks.length; i++) {
        if (playingInfo.uuid === currentTracks[i].uuid) {
          dispatch(fetchTrackAudio(currentTracks[i + 1].uuid));
        }
      }
    }
  };

  const onMouseEnter = () => {
    setIsVolumeHover(true);
  };

  const onMouseLeave = () => {
    setIsVolumeHover(false);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, [audioRef.current]);

  const onVolumeChange = () => {
    if (volumeRef.current && audioRef.current) {
      const percent = Number(volumeRef.current.value) - 1;
      volumeRef.current.style.background = `linear-gradient(90deg, #4D9FC4 ${percent}%, #BACED980 ${percent}%)`;

      audioRef.current.volume = Number(volumeRef.current.value) / 100;

      if (audioRef.current.volume === 0) {
        setVolumeImage(volumeMuteSvg);
      } else if (audioRef.current.volume >= 0.7) {
        setVolumeImage(volumeHighSvg);
      } else {
        setVolumeImage(volumeLowSvg);
      }
    }
  };

  return (
    <section className={styles.container}>
      <audio src={playingInfo.src} ref={audioRef} onTimeUpdate={onTimeUpdate} />
      <div className={styles.timeline}>
        <div className={styles.timeline_active} ref={timelineActiveRef} />
        <span>{currentTime}</span>
        <span>{convertSecondsToString(playingInfo.duration)}</span>
      </div>
      <div className={styles.content}>
        <div className={styles.content_left_container}>
          <div className={styles.image_container}>
            {playingInfo.coverSrc && <img src={playingInfo.coverSrc} alt="" />}
          </div>
          <div className={styles.title_container}>
            <h2 className={styles.title}>{playingInfo.title}</h2>
            <h3 className={styles.subtitle}>{playingInfo.artist_name}</h3>
          </div>
          {isLiked ?
            <img className={styles.like} src={heartFillSvg} alt="" onClick={onUnlikeClick} /> :
            <img className={styles.like} src={heartOutlineSvg} alt="" onClick={onLikeClick} />}
          <img className={styles.download} src={downloadSvg} alt="" onClick={onDownloadTrack} />
        </div>
        <div className={styles.content_center_container}>
          <img src={skipPreviousSvg} alt="" onClick={onSkipPrevious} />
          <img src={isPlaying ? pauseSvg : playSvg} alt="" onClick={onPlayClick} />
          <img src={skipNextSvg} alt="" onClick={onSkipNext} />
        </div>
        <div className={styles.volume_container} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <img className={styles.volume} src={volumeImage} alt="" />
          <div className={styles.volume_bar_wrapper} style={{ display: isVolumeHover ? 'block' : 'none' }}>
            <div className={styles.volume_bar_container}>
              <input
                className={styles.volume_bar}
                type="range"
                min={0}
                max={100}
                defaultValue={audioRef.current ? Number(audioRef.current.volume) * 100 : 50}
                onInput={onVolumeChange}
                ref={volumeRef}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
