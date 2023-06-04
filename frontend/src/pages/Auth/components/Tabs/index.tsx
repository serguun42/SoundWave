import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../hooks/redux';
import { SelectedTab } from '../../../../redux/slices/auth/types';
import { setSelectedTab } from '../../../../redux/slices/auth';
import { selectedTabSelector } from '../../../../redux/slices/auth/selectors';
import styles from './Tabs.module.css';

type Props = {
  className?: string;
  leftText: string;
  rightText: string;
};

export function Tabs({ className, leftText, rightText }: Props) {
  const dispatch = useAppDispatch();

  const selectedTab = useSelector(selectedTabSelector);

  const onLeftTabClick = () => {
    dispatch(setSelectedTab(SelectedTab.left));
  };

  const onRightTabClick = () => {
    dispatch(setSelectedTab(SelectedTab.right));
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <section className={`${styles.container} ${selectedTab === SelectedTab.right ? styles.right_tab_selected : ''}`}>
        <button className={styles.button} onClick={onLeftTabClick}>
          <span>{leftText}</span>
        </button>
        <button className={styles.button} onClick={onRightTabClick}>
          <span>{rightText}</span>
        </button>
      </section>
    </div>
  );
}
