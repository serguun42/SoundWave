import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { currentTracksSelector, likedTracksSelector, playingInfoSelector } from '../../redux/slices/tracks/selectors';
import { useAppDispatch } from '../../hooks/redux';
import { fetchLikedTracks, fetchTrackCover, fetchTracksByPlaylist } from '../../redux/slices/tracks/thunks';
import { Track, TrackProps } from './components/Track';
import styles from './Playlist.module.css';
import { clearCurrentTracks } from '../../redux/slices/tracks';

export enum PlaylistType {
  likedTracks = 'likedTracks',
  likedPlaylists = 'likedPlaylists',
}

export function Playlist() {
  const dispatch = useAppDispatch();
  const { type } = useParams();

  const likedTracks = useSelector(likedTracksSelector);
  const currentTracks = useSelector(currentTracksSelector);
  const playingInfo = useSelector(playingInfoSelector);
  const [tracks, setTracks] = useState<JSX.Element[]>();

  const findTrackPosition = () => {
    if (tracks) {
      for (let i = 0; i < tracks.length; i++) {
        const trackProps = tracks[i].props as TrackProps;
        if (trackProps.uuid === playingInfo.uuid) {
          return trackProps.position - 1;
        }
      }
    }
    return -1;
  };

  useEffect(() => {
    const lal = () => {
      console.log(89389128932198);
      // let loadTracks = () => {};
      // dispatch(clearCurrentTracks());
      // setTracks(undefined);
      switch (type) {
        case PlaylistType.likedTracks: {
          dispatch(fetchLikedTracks());
          // if (likedTracks.length === 0) {
          //   dispatch(fetchLikedTracks());
          // } else {
          //   loadTracks = async () => {
          //     const items = await Promise.all(likedTracks.map(async (item, index) => {
          //       const imageUrl = await dispatch(fetchTrackCover(item.uuid)).unwrap();
          //       return (
          //         <Track
          //           key={item.uuid}
          //           position={index + 1}
          //           uuid={item.uuid}
          //           duration={item.duration}
          //           title={item.title}
          //           artist_name={item.artist_name}
          //           imgSrc={imageUrl}
          //         />
          //       );
          //     }));
          //     setTracks(items);
          //     findTrackPosition();
          //   };
          // }
          break;
        }
        default: {
          // if (type) {
          //   loadTracks = async () => {
          //     const tracks = await dispatch(fetchTracksByPlaylist(type)).unwrap();
          //     const items = await Promise.all(tracks.map(async (item, index) => {
          //       const imageUrl = await dispatch(fetchTrackCover(item.uuid)).unwrap();
          //       return (
          //         <Track
          //           key={item.uuid}
          //           position={index + 1}
          //           uuid={item.uuid}
          //           duration={item.duration}
          //           title={item.title}
          //           artist_name={item.artist_name}
          //           imgSrc={imageUrl}
          //         />
          //       );
          //     }));
          //     setTracks(items);
          //   };
          // }
          if (type) {
            dispatch(fetchTracksByPlaylist(type));
          }
          break;
        }
      }
    };
    lal();
    // loadTracks();
  }, [dispatch, type]);

  useEffect(() => {
    const items = currentTracks.map((item, index) => (
      <Track
        key={item.uuid}
        position={index + 1}
        uuid={item.uuid}
        duration={item.duration}
        title={item.title}
        artist_name={item.artist_name}
        imgSrc={item.imgSrc}
      />
    ));
    setTracks(items);
  }, [dispatch, currentTracks]);

  // const loadTracks = async () => {
  //   console.log('LOAD TRACKS');
  //   // const tracks = await dispatch(fetchTracksByPlaylist(type)).unwrap();
  //   const items = await Promise.all(currentTracks.map(async (item, index) => {
  //     console.log('Load images');
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
  //   return items;
  //   // setTracks(items);
  // };

  return (
    <div className={styles.container}>
      {tracks}
    </div>
  );
}
