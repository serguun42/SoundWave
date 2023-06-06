import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../../hooks/redux';
import { logout } from '../../../../redux/slices/auth/thunks';
import defaultPng from '../../../../assets/header/default_avatar.png';
import styles from './Avatar.module.css';

export function Avatar() {
  const arrow = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_37_492)">
        <path d="M6 9L12 15L18 9" stroke="#8F9397" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_37_492">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const onClick = () => {
    setIsMenuVisible(prev => !prev);
  };

  const onLogoutClick = async () => {
    const response = await dispatch(logout()).unwrap();
    if (response.ok) {
      setIsMenuVisible(false);
      navigate('/auth');
    }
  };

  return (
    <div className={styles.container} onClick={onClick}>
      <img src={defaultPng} alt="Avatar" />
      <div className={styles.arrow}>{arrow}</div>
      {isMenuVisible && (
        <div className={styles.menu}>
          <div onClick={onLogoutClick}>Log out</div>
        </div>
      )}
    </div>
  );
}
