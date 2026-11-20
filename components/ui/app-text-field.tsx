import { StyleSheet } from 'react-native';
import { TextInput, type TextInputProps } from 'react-native-paper';

export function AppTextField({ style, ...rest }: TextInputProps) {
  return <TextInput {...rest} mode="outlined" style={[styles.input, style]} />;
}

const styles = StyleSheet.create({
  input: {
    alignSelf: 'stretch',
  },
});
