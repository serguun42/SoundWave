import { Card } from './components/Card';
import pianoJpg from '../../assets/home/piano.jpg';
import minionInWaterJpg from '../../assets/home/minion_in_water.jpg';
import womanWithLaptopJpg from '../../assets/home/woman_with_laptop.jpg';
import sunsetPalmsJpg from '../../assets/home/sunset_palms.jpg';
import flamingoOnWaterJpg from '../../assets/home/flamingo_on_water.jpg';
import styles from './Home.module.css';

export function Home() {
  return (
    <section className={styles.cards_container}>
      <h2 className={styles.title}>Trending now</h2>
      <Card imgSrc={pianoJpg} title="Peacful Piano" subtitle="Playlist" />
      <Card imgSrc={minionInWaterJpg} title="Chill" subtitle="Playlist" />
      <Card imgSrc={womanWithLaptopJpg} title="Focus Flow" subtitle="Playlist" />
      <Card imgSrc={sunsetPalmsJpg} title="Jazz Hits" subtitle="Playlist" />
      <Card imgSrc={flamingoOnWaterJpg} title="Summer" subtitle="Playlist" />
      <Card title="Test 1" subtitle="Something 1" />
      <Card title="Test 2" subtitle="Something 2" />
      <Card title="Test 3" subtitle="Something 3" />
    </section>
  );
}
