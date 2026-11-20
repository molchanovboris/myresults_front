import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'react-native-paper';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/app-button';
import { AppTextField } from '@/components/ui/app-text-field';
import { ScreenTitle } from '@/components/ui/screen-title';
import { decodeVin } from '@/lib/catalog';

type VinFormValues = {
  vin: string;
};

const vinRules = {
  required: 'VIN is required',
  minLength: { value: 11, message: 'VIN should contain at least 11 characters' },
  maxLength: { value: 17, message: 'VIN should contain at most 17 characters' },
  pattern: { value: /^[A-HJ-NPR-Z0-9*]+$/i, message: 'VIN has invalid characters' },
};

export default function FindCarByVinScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VinFormValues>({
    mode: 'onChange',
    defaultValues: { vin: '' },
  });

  const decode = useMutation({
    mutationFn: (vin: string) => decodeVin(vin),
    onSuccess: (data, vin) => {
      router.push({
        pathname: '/(tabs)/main/new-car/details',
        params: {
          vin,
          make: data.make ?? '',
          model: data.model ?? '',
          year: data.year != null ? String(data.year) : '',
        },
      });
    },
  });

  const onNext = ({ vin }: VinFormValues) => {
    decode.mutate(vin.trim().toUpperCase());
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ScreenTitle>Find by VIN</ScreenTitle>
        <Controller
          control={control}
          name="vin"
          rules={vinRules}
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextField
              label="VIN"
              value={value}
              onChangeText={(next) => onChange(next.toUpperCase())}
              onBlur={onBlur}
              autoCapitalize="characters"
              autoCorrect={false}
              error={!!errors.vin}
            />
          )}
        />
        {errors.vin ? <ThemedText style={styles.errorText}>{errors.vin.message}</ThemedText> : null}
        {decode.error ? <ThemedText style={styles.errorText}>{decode.error.message}</ThemedText> : null}
        <AppButton onPress={handleSubmit(onNext)} loading={decode.isPending} disabled={decode.isPending}>
          Next
        </AppButton>
        <Button mode="text" onPress={() => router.push('/(tabs)/main/new-car/details')} disabled={decode.isPending}>
          Enter manually
        </Button>
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
    padding: 24,
    gap: 12,
  },
  errorText: {
    color: '#d32f2f',
    marginTop: -6,
  },
});
