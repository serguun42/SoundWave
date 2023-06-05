import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { likedTracksSelector } from '../../redux/slices/tracks/selectors';
import { useAppDispatch } from '../../hooks/redux';
import { fetchTrackCover } from '../../redux/slices/tracks/thunks';
import { Track } from './components/Track';
import styles from './Playlist.module.css';

export enum PlaylistType {
  likedTracks = 'likedTracks',
  likedPlaylists = 'likedPlaylists',
}

export function Playlist() {
  const dispatch = useAppDispatch();
  const { type } = useParams();

  const [tracks, setTracks] = useState<JSX.Element[]>();
  const likedTracks = useSelector(likedTracksSelector);

  useEffect(() => {
    let loadTracks = () => {};
    switch (type) {
      case PlaylistType.likedTracks: {
        loadTracks = async () => {
          const items = await Promise.all(likedTracks.map(async (item, index) => {
            const imageUrl = await dispatch(fetchTrackCover(item.uuid)).unwrap();
            return (
              <Track
                key={item.uuid}
                position={index + 1}
                uuid={item.uuid}
                duration={item.duration}
                title={item.title}
                artist_name={item.artist_name}
                imgSrc={imageUrl}
              />
            );
          }));
          setTracks(items);
        };
        break;
      }
      case PlaylistType.likedPlaylists: {
        break;
      }
      default: {
        // loadTracks = async () => {
        //   const tracks = ;
        //   const items = await Promise.all(likedTracks.map(async (item, index) => {
        //     const imageUrl = await dispatch(fetchTrackCover(item.uuid)).unwrap();
        //     return (
        //       <Track
        //         key={item.uuid}
        //         position={index + 1}
        //         uuid={item.uuid}
        //         duration={item.duration}
        //         title={item.title}
        //         artist_name={item.artist_name}
        //         imgSrc={imageUrl}
        //       />
        //     );
        //   }));
        //   setTracks(items);
        // };
        break;
      }
    }
    loadTracks();
  }, [dispatch, type, likedTracks]);

  return (
    <div className={styles.container}>
      {tracks}
    </div>
  );
}
