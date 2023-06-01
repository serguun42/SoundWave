import { Logo } from '../../components/Logo';
import { Tabs } from './components/Tabs';
import { Input } from './components/Input';
import { Button } from './components/Button';
import styles from './Auth.module.css';

export function Auth() {
  const leftTabContent = (
    <div className={styles.inputs_container}>
      <Input type="email" title="Email address" placeholder="Your email" />
      <Input type="password" title="Password" placeholder="Password" />
    </div>
  );

  const rightTabContent = (
    <div className={styles.inputs_container}>
      <Input type="email" title="Email address" placeholder="Your email" />
      <Input type="password" title="Password" placeholder="Password" />
      <Input type="password" title="Confirm Password" placeholder="Confirm Password" />
    </div>
  );

  return (
    <div className={styles.wrapper}>
      <section className={styles.container}>
        <Logo className={styles.logo} />
        <Tabs className={styles.tabs} leftText="Log in" rightText="Register" />
        {rightTabContent}
        <Button text="Register Account" onClick={() => console.log(1)} />
      </section>
    </div>
  );
}
