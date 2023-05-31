import styles from './Card.module.css';

type Props = {
  imgSrc?: string,
  title: string,
  subtitle: string
};

export function Card({ imgSrc, title, subtitle }: Props) {
  return (
    <section className={styles.container}>
      <div className={styles.image_container}>
        {imgSrc && <img src={imgSrc} alt="Playlist preview" />}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <span className={styles.subtitle}>{subtitle}</span>
    </section>
  );
}
