import type { ReactNode } from 'react';
import { Button, type ButtonProps } from 'react-native-paper';

type AppButtonProps = Omit<ButtonProps, 'mode' | 'children'> & {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
};

export function AppButton({ variant = 'primary', children, ...rest }: AppButtonProps) {
  return (
    <Button {...rest} mode={variant === 'primary' ? 'contained' : 'outlined'}>
      {children}
    </Button>
  );
}
