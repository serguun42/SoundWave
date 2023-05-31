import { useState } from 'react';
import heartFillSvg from '../../../../assets/player/heart_fill.svg';
import heartOutlineSvg from '../../../../assets/player/heart_outline.svg';
import playSvg from '../../../../assets/player/play.svg';
import pauseSvg from '../../../../assets/player/pause.svg';
import skipPreviousSvg from '../../../../assets/player/skip_previous.svg';
import skipNextSvg from '../../../../assets/player/skip_next.svg';
import volumeMuteSvg from '../../../../assets/player/volume_mute.svg';
import volumeLowSvg from '../../../../assets/player/volume_low.svg';
import volumeHighSvg from '../../../../assets/player/volume_high.svg';
import styles from './Player.module.css';

export function Player() {
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const onLikeClick = () => {
    setIsLiked(prev => !prev);
  };

  const onPlayClick = () => {
    setIsPlaying(prev => !prev);
  };

  return (
    <section className={styles.container}>
      <div className={styles.timeline}>
        <span>0:00</span>
        <span>2:28</span>
      </div>
      <div className={styles.content}>
        <div className={styles.content_left_container}>
          <div className={styles.image_container}>
            <img src="" alt="" />
          </div>
          <div className={styles.title_container}>
            <h2 className={styles.title}>Test title</h2>
            <h3 className={styles.subtitle}>Test artist</h3>
          </div>
          <img className={styles.like} src={isLiked ? heartFillSvg : heartOutlineSvg} alt="" onClick={onLikeClick} />
        </div>
        <div className={styles.content_center_container}>
          <img src={skipPreviousSvg} alt="" />
          <img src={isPlaying ? pauseSvg : playSvg} alt="" onClick={onPlayClick} />
          <img src={skipNextSvg} alt="" />
        </div>
        <img className={styles.volume} src={volumeHighSvg} alt="" />
      </div>
    </section>
  );
}
