import { Link, NavLink } from 'react-router-dom';
import { Logo } from '../../../../components/Logo';
import { PlaylistType } from '../../../Playlist';
import homeSvg from '../../../../assets/navbar/home.svg';
import likedSvg from '../../../../assets/navbar/liked.svg';
import styles from './Navbar.module.css';

export function Navbar() {
  return (
    <div className={styles.container}>
      <Link to="/" className={styles.logo_container}>
        <Logo />
      </Link>
      <nav className={styles.navbar}>
        <ul>
          <li>
            <NavLink to="/home">
              <img src={homeSvg} alt="" />
              <span>Home</span>
            </NavLink>
          </li>
        </ul>
        <div className={styles.navbar_category_text}>Playlists</div>
        <ul>
          <li>
            <NavLink to={`/playlist/${PlaylistType.likedTracks}`}>
              <img src={likedSvg} alt="" />
              <span>Liked tracks</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/likedPlaylists">
              <img src={likedSvg} alt="" />
              <span>Liked playlists</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
