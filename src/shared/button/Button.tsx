import React from 'react';

import styles from './Button.module.scss';
import { LoadingSpinner } from '../loadingSpinner';
import { classNames } from '@/utils/classNames';

interface Props {
  color: 'primary' | 'secondary';
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'submit' | 'reset' | 'button';
  full?: boolean;
  showLoader?: boolean;
}

const Button: React.FC<Props> = ({
  onClick,
  children,
  className,
  color = 'primary',
  disabled,
  type,
  full,
  showLoader = false,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={classNames(
        styles.Default,
        full ? 'w-full' : 'w-40',
        color !== 'primary' && styles['Secondary'],
        className
      )}
      style={{ fontWeight: '500' }}>
      {showLoader && (
        <LoadingSpinner
          size={24}
          color={color === 'primary' ? '#ffffff' : '#de3333'}
        />
      )}
      {children}
    </button>
  );
};

export default Button;