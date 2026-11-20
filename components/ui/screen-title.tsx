import type { ReactNode } from 'react';
import type { StyleProp, TextStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type ScreenTitleProps = {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
};

export function ScreenTitle({ children, style }: ScreenTitleProps) {
  return (
    <ThemedText type="title" style={style}>
      {children}
    </ThemedText>
  );
}
