import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import eyeHideSvg from '../../../../assets/auth/eye_hide.svg';
import eyeShowSvg from '../../../../assets/auth/eye_show.svg';
import styles from './Input.module.css';

type Props = {
  type?: 'password';
  title?: string;
  placeholder?: string;
};

export type InputHandle = {
  value: () => string | undefined;
};

export const Input = forwardRef<InputHandle, Props>(function Input({ type = 'text', title, placeholder }, ref) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  useImperativeHandle(ref, () => ({ value: () => inputRef.current?.value }));

  const onContainerClick = () => {
    const inputElement = inputRef.current;
    if (inputElement && document.activeElement !== inputElement) {
      const setFocus = () => {
        inputElement.focus();
        const end = inputElement.value.length ?? 0;
        inputElement.setSelectionRange(end, end);
      };

      setFocus();
    }
  };

  const onEyeClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    setIsPasswordShow(prev => !prev);
  };

  return (
    <div className={styles.container} onClick={onContainerClick}>
      <span className={styles.title}>{title}</span>
      <div className={styles.input_container}>
        <input
          className={styles.input}
          type={isPasswordShow ? 'text' : type}
          placeholder={placeholder}
          ref={inputRef}
        />
        {type === 'password' && <img src={isPasswordShow ? eyeShowSvg : eyeHideSvg} alt="" onClick={onEyeClick} />}
      </div>
    </div>
  );
});
