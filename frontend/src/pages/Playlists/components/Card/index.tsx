import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Card.module.css';

type Props = {
  uuid: string,
  imgSrc?: string,
  title: string,
  subtitle: string
};

export function Card({ uuid, imgSrc, title, subtitle }: Props) {
  const navigate = useNavigate();

  const [isHover, setIsHover] = useState(false);

  const onMouseEnter = () => {
    setIsHover(true);
  };

  const onMouseLeave = () => {
    setIsHover(false);
  };

  const onClick = () => {
    navigate(`/playlist/${uuid}`);
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.image_container} ${isHover ? styles.hover : ''}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        {imgSrc && <img src={imgSrc} alt="" />}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <span className={styles.subtitle}>{subtitle}</span>
    </div>
  );
}
