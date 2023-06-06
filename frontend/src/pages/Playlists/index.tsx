import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { Card } from './components/Card';
// eslint-disable-next-line import/no-relative-packages
import { Playlist as PlaylistType } from '../../../../backend/src/types/entities';
import pianoJpg from '../../assets/home/piano.jpg';
import minionInWaterJpg from '../../assets/home/minion_in_water.jpg';
import womanWithLaptopJpg from '../../assets/home/woman_with_laptop.jpg';
import sunsetPalmsJpg from '../../assets/home/sunset_palms.jpg';
import flamingoOnWaterJpg from '../../assets/home/flamingo_on_water.jpg';
import styles from './Playlists.module.css';
import { fetchPlaylistCover } from '../../redux/slices/playlists/thunks';

type FilteredPlaylistType = Omit<PlaylistType, 'sum_duration'>;

type Props = {
  title?: string;
  playlists: FilteredPlaylistType[];
};

export function Playlists({ title, playlists }: Props) {
  const dispatch = useAppDispatch();

  const [cards, setCards] = useState<JSX.Element[]>();

  useEffect(() => {
    const loadCards = async () => {
      const items = await Promise.all(playlists.map(async item => {
        const imageUrl = await dispatch(fetchPlaylistCover(item.uuid)).unwrap();
        return (
          <Card
            key={item.uuid}
            uuid={item.uuid}
            imgSrc={imageUrl}
            title={item.title}
            subtitle={item.owner}
          />
        );
      }));
      setCards(items);
    };
    loadCards();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (cards) {
    return (
      <section className={styles.container}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {cards}
        {/* <Card imgSrc={pianoJpg} title="Peacful Piano" subtitle="Playlist" />
        <Card imgSrc={minionInWaterJpg} title="Chill" subtitle="Playlist" />
        <Card imgSrc={womanWithLaptopJpg} title="Focus Flow" subtitle="Playlist" />
        <Card imgSrc={sunsetPalmsJpg} title="Jazz Hits" subtitle="Playlist" />
        <Card imgSrc={flamingoOnWaterJpg} title="Summer" subtitle="Playlist" />
        <Card title="Test 1" subtitle="Something 1" />
        <Card title="Test 2" subtitle="Something 2" />
        <Card title="Test 3" subtitle="Something 3" /> */}
      </section>
    );
  }
  return null;
}
