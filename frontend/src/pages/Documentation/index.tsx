import png1 from '../../assets/documentation/1.png';
import png2 from '../../assets/documentation/2.png';
import png3 from '../../assets/documentation/3.png';
import png4 from '../../assets/documentation/4.png';
import png5 from '../../assets/documentation/5.png';
import png6 from '../../assets/documentation/6.png';
import png7 from '../../assets/documentation/7.png';
import styles from './Documentation.module.css';

export function Documentation() {
  return (
    <div className={styles.contatiner}>
      <div className={styles.content}>
        <h1>Документация</h1>
        <h2>Управление треком</h2>
        <section>
          <h3>Воспроизведение/Пауза трека</h3>
          <p>Воспроизвести или поставить трек на паузу можно с помощью этой кнопки</p>
          <img src={png1} alt="" />
        </section>
        <section>
          <h3>Переключение трека вперед/назад</h3>
          <p>Переключить трек вперед или назад можно с помощью соответствующих кнопок</p>
          <img src={png2} alt="" />
        </section>
        <section>
          <h3>Добавить трек в избранное</h3>
          <p>Добавить трек в плейлист избранного можно если нажать кнопку сердечка на в левой части панели трека</p>
          <img src={png3} alt="" />
        </section>
        <section>
          <h3>Изменить громкость трека</h3>
          <p>Изменить громкость трека можно, нажав кнопку громкости в правой части панели трека</p>
          <img src={png4} alt="" />
        </section>
        <section>
          <h3>Узнать продолжительность трека</h3>
          <p>Узнать продолжительность трека можно посмотрев на соответствующие метки времени</p>
          <img src={png5} alt="" />
        </section>
        <h2>Авторизация/Регистрация</h2>
        <section>
          <h3>Авторизоваться</h3>
          <p>Чтобы авторизоваться перейдите <a href="https://soundwave.mirea.xyz/docs">сюда</a> и выберите вкладку "Войти"</p>
          <img style={{ height: '600px' }} src={png6} alt="" />
        </section>
        <section>
          <h3>Зарегестрироваться</h3>
          <p>Чтобы зарегестрироваться перейдите <a href="http://soundwave.mirea.xyz/docs">сюда</a> и выберите вкладку "зарегестрироваться"</p>
          <img style={{ height: '600px' }} src={png7} alt="" />
        </section>
      </div>
    </div>
  );
}
