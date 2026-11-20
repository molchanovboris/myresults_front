import { StyleSheet } from 'react-native';
import { TextInput, type TextInputProps } from 'react-native-paper';

export function AppTextArea({ style, ...rest }: TextInputProps) {
  return (
    <TextInput {...rest} mode="outlined" multiline numberOfLines={3} style={[styles.input, style]} />
  );
}

const styles = StyleSheet.create({
  input: {
    alignSelf: 'stretch',
    minHeight: 80,
  },
});
