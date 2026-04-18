import { Link, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppStore } from '@/lib/stores/use-app-store';

type SignupFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupScreen() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SignupFormValues>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const passwordValue = watch('password');
  const setToken = useAppStore((state) => state.setToken);

  const onSignup = ({ email }: SignupFormValues) => {
    setToken(`demo-token:${email.trim()}`);
    router.replace('/(tabs)/profile');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title">Sign up</ThemedText>
        <ThemedText style={styles.subtitle}>Create a test account to enter the app.</ThemedText>

        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: 'Enter a valid email',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              keyboardType="email-address"
              mode="outlined"
              style={styles.input}
              error={!!errors.email}
            />
          )}
        />
        {errors.email ? <ThemedText style={styles.errorText}>{errors.email.message}</ThemedText> : null}

        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              mode="outlined"
              style={styles.input}
              error={!!errors.password}
            />
          )}
        />
        {errors.password ? (
          <ThemedText style={styles.errorText}>{errors.password.message}</ThemedText>
        ) : null}

        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: 'Please confirm password',
            validate: (value) => value === passwordValue || 'Passwords do not match',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Confirm password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              mode="outlined"
              style={styles.input}
              error={!!errors.confirmPassword}
            />
          )}
        />
        {errors.confirmPassword ? (
          <ThemedText style={styles.errorText}>{errors.confirmPassword.message}</ThemedText>
        ) : null}

        <Button mode="contained" onPress={handleSubmit(onSignup)} disabled={!isValid}>
          Create account
        </Button>

        <Link href="/(auth)/login" asChild>
          <Button mode="text">I already have an account</Button>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: 8,
  },
  input: {
    width: '100%',
  },
  errorText: {
    color: '#d32f2f',
    marginTop: -6,
  },
});
