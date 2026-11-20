import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/app-button';
import { AppTextField } from '@/components/ui/app-text-field';
import { ScreenTitle } from '@/components/ui/screen-title';
import { requestAuthCode, verifyAuthCode } from '@/lib/auth';
import { useAppStore } from '@/lib/stores/use-app-store';

type LoginFormValues = {
  email: string;
  code: string;
};

export default function LoginScreen() {
  const [codeSent, setCodeSent] = useState(false);
  const setToken = useAppStore((state) => state.setToken);
  const {
    control,
    getValues,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      code: '',
    },
  });

  const verify = useMutation({
    mutationFn: ({ email, code }: LoginFormValues) => verifyAuthCode(email, code),
    onSuccess: ({ token }) => {
      setToken(token);
    },
  });

  const requestCode = useMutation({
    mutationFn: (email: string) => requestAuthCode(email),
    onSuccess: () => {
      setCodeSent(true);
      verify.reset();
    },
  });

  const onSendCode = async () => {
    const emailValid = await trigger('email');
    if (!emailValid) return;
    requestCode.mutate(getValues('email').trim());
  };

  const onVerify = async () => {
    const valid = await trigger(['email', 'code']);
    if (!valid) return;
    const { email, code } = getValues();
    verify.mutate({ email: email.trim(), code: code.trim() });
  };

  const errorMessage = verify.error?.message ?? requestCode.error?.message;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ScreenTitle>Sign in</ScreenTitle>
        <ThemedText style={styles.subtitle}>
          Enter your email. We will send a 6-digit code. A new account is created on the first sign-in.
        </ThemedText>

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
            <AppTextField
              label="Email"
              value={value}
              onChangeText={(next) => {
                onChange(next);
                if (codeSent) {
                  setCodeSent(false);
                  setValue('code', '');
                }
              }}
              onBlur={onBlur}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              error={!!errors.email}
            />
          )}
        />
        {errors.email ? <ThemedText style={styles.errorText}>{errors.email.message}</ThemedText> : null}

        {codeSent ? (
          <>
            <Controller
              control={control}
              name="code"
              rules={{
                required: 'Code is required',
                pattern: {
                  value: /^\d{6}$/,
                  message: 'Enter the 6-digit code',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AppTextField
                  label="Code"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="number-pad"
                  maxLength={6}
                  error={!!errors.code}
                />
              )}
            />
            {errors.code ? <ThemedText style={styles.errorText}>{errors.code.message}</ThemedText> : null}
          </>
        ) : null}

        {errorMessage ? <ThemedText style={styles.errorText}>{errorMessage}</ThemedText> : null}

        {codeSent ? (
          <>
            <AppButton onPress={onVerify} loading={verify.isPending} disabled={verify.isPending}>
              Sign in
            </AppButton>
            <Button mode="text" onPress={onSendCode} loading={requestCode.isPending} disabled={requestCode.isPending}>
              Send code again
            </Button>
          </>
        ) : (
          <AppButton onPress={onSendCode} loading={requestCode.isPending} disabled={requestCode.isPending}>
            Send code
          </AppButton>
        )}
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
  errorText: {
    color: '#d32f2f',
    marginTop: -6,
  },
});
