import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../hooks/redux';
import { isCookieExists } from '../../helpers';
import { check, login, register } from '../../redux/slices/auth/thunks';
import { SelectedTab } from '../../redux/slices/auth/types';
import { selectedTabSelector } from '../../redux/slices/auth/selectors';
import { Logo } from '../../components/Logo';
import { Tabs } from './components/Tabs';
import { Input, InputHandle } from './components/Input';
import { Button } from './components/Button';
import styles from './Auth.module.css';

export function Auth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const usernameInputRef = useRef<InputHandle>(null);
  const passwordInputRef = useRef<InputHandle>(null);
  const confirmPasswordInputRef = useRef<InputHandle>(null);
  const selectedTab = useSelector(selectedTabSelector);

  useEffect(() => {
    if (isCookieExists('session_token')) {
      navigate('/home');
    }
  }, [navigate]);

  const loginAndRedirect = async (username: string, password: string) => {
    await dispatch(login({ username, password }));
    const checkLogin = await dispatch(check()).unwrap();
    if (checkLogin.ok) {
      navigate('/home');
    }
  };

  const onLoginButtonClick = async () => {
    const username = usernameInputRef.current?.value();
    const password = passwordInputRef.current?.value();
    if (username && password) {
      loginAndRedirect(username, password);
    }
  };

  const onSignupButtonClick = async () => {
    const username = usernameInputRef.current?.value();
    const password = passwordInputRef.current?.value();
    const confirmPassword = confirmPasswordInputRef.current?.value();
    if (username && password && confirmPassword && password === confirmPassword) {
      await dispatch(register({ username, password }));
      loginAndRedirect(username, password);
    }
  };

  const loginContent = (
    <>
      <div className={styles.inputs_container}>
        <Input title="Username" placeholder="Your username" ref={usernameInputRef} />
        <Input type="password" title="Password" placeholder="Password" ref={passwordInputRef} />
      </div>
      <Button text="Log in" onClick={onLoginButtonClick} />
    </>
  );

  const signupContent = (
    <>
      <div className={styles.inputs_container}>
        <Input title="Username" placeholder="Your username" ref={usernameInputRef} />
        <Input type="password" title="Password" placeholder="Password" ref={passwordInputRef} />
        <Input type="password" title="Confirm Password" placeholder="Confirm Password" ref={confirmPasswordInputRef} />
      </div>
      <Button text="Create new account" onClick={onSignupButtonClick} />
    </>
  );

  return (
    <div className={styles.wrapper}>
      <section className={styles.container}>
        <Logo className={styles.logo} />
        <Tabs className={styles.tabs} leftText="Log in" rightText="Sign up" />
        {selectedTab === SelectedTab.left ? loginContent : signupContent}
      </section>
    </div>
  );
}
