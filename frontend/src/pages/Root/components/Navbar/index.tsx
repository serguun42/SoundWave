import { Link, NavLink } from 'react-router-dom';
import { Logo } from '../../../../components/Logo';
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
            <NavLink to="home">
              <img src={homeSvg} alt="home" />
              <span>Home</span>
            </NavLink>
          </li>
        </ul>
        <div className={styles.navbar_category_text}>Playlists</div>
        <ul>
          <li>
            <NavLink to="/playlist:id"> {/* тут должен быть id плейлиста пользователя liked */}
              <img src={likedSvg} alt="liked" />
              <span>Liked</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
