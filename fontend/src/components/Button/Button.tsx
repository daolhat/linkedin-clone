import type { ButtonHTMLAttributes } from 'react';
import classes from './Button.module.scss';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  outline?: boolean;
  size?: "small" | "medium" | "large";
};

export function Button({ outline, size = "large", className, children, ...others }: IButtonProps) {
  return (
    <button
      {...others}
      className={`
        ${classes.root} 
        ${outline ? classes.outline : ""} 
        ${classes[size]} 
        ${className}
        `}
    >
      {children}
    </button>
  );
}
