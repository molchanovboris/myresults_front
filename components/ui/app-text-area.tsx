import { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, type TextInputProps } from 'react-native-paper';

type TextAreaRef = {
  focus: () => void;
};

export const AppTextArea = forwardRef<TextAreaRef, TextInputProps>(function AppTextArea({ style, ...rest }, ref) {
  return (
    <TextInput
      ref={ref as never}
      {...rest}
      mode="outlined"
      multiline
      numberOfLines={3}
      style={[styles.input, style]}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    alignSelf: 'stretch',
    minHeight: 80,
  },
});
