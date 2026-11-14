import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, TextInput } from 'react-native-paper';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useCreateCar } from '@/lib/hooks/use-create-car';
import { queryClient } from '@/lib/query-client';
import { useAppStore } from '@/lib/stores/use-app-store';
import type { CreateCarInput } from '@/lib/types';

type CarDetailsFormValues = {
  make: string;
  model: string;
  year: string;
  color: string;
  mileage: string;
};

function paramValue(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw ?? '';
}

export default function NewCarDetailsScreen() {
  const params = useLocalSearchParams<{
    vin?: string;
    make?: string;
    model?: string;
    year?: string;
  }>();
  const vin = paramValue(params.vin).trim().toUpperCase();
  const createCar = useCreateCar();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CarDetailsFormValues>({
    mode: 'onChange',
    defaultValues: {
      make: paramValue(params.make),
      model: paramValue(params.model),
      year: paramValue(params.year),
      color: '',
      mileage: '',
    },
  });

  const onCreate = ({ make, model, year, color, mileage }: CarDetailsFormValues) => {
    const yearNumber = Number(year);
    const input: CreateCarInput = {
      make: make.trim(),
      model: model.trim(),
      mileage: Number(mileage),
    };

    if (vin) input.vin = vin;
    if (year.trim()) input.year = yearNumber;
    if (color.trim()) input.color = color.trim();

    createCar.mutate(input, {
      onSuccess: (created) => {
        const token = useAppStore.getState().token;
        queryClient.setQueryData(['cars', token, created.car.id], created);
        router.replace(`/(tabs)/main/current-car/${created.car.id}`);
      },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ThemedText type="title">Car details</ThemedText>
        {vin ? <ThemedText style={styles.subtitle}>VIN {vin}</ThemedText> : null}

        <Controller
          control={control}
          name="make"
          rules={{ required: 'Make is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Make"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="words"
              mode="outlined"
              style={styles.input}
              error={!!errors.make}
            />
          )}
        />
        {errors.make ? <ThemedText style={styles.errorText}>{errors.make.message}</ThemedText> : null}

        <Controller
          control={control}
          name="model"
          rules={{ required: 'Model is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Model"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="words"
              mode="outlined"
              style={styles.input}
              error={!!errors.model}
            />
          )}
        />
        {errors.model ? <ThemedText style={styles.errorText}>{errors.model.message}</ThemedText> : null}

        <Controller
          control={control}
          name="year"
          rules={{
            validate: (value) => {
              if (!value.trim()) return true;
              const yearValue = Number(value);
              if (!Number.isInteger(yearValue) || yearValue < 1900 || yearValue > 2100) {
                return 'Year must be a whole number from 1900 to 2100';
              }
              return true;
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Year"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="number-pad"
              mode="outlined"
              style={styles.input}
              error={!!errors.year}
            />
          )}
        />
        {errors.year ? <ThemedText style={styles.errorText}>{errors.year.message}</ThemedText> : null}

        <Controller
          control={control}
          name="mileage"
          rules={{
            required: 'Mileage is required',
            validate: (value) => /^\d+$/.test(value.trim()) || 'Mileage must be a whole number',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Mileage"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="number-pad"
              mode="outlined"
              style={styles.input}
              error={!!errors.mileage}
            />
          )}
        />
        {errors.mileage ? <ThemedText style={styles.errorText}>{errors.mileage.message}</ThemedText> : null}

        <Controller
          control={control}
          name="color"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Color"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="words"
              mode="outlined"
              style={styles.input}
            />
          )}
        />

        {createCar.error ? <ThemedText style={styles.errorText}>{createCar.error.message}</ThemedText> : null}

        <Button
          mode="contained"
          onPress={handleSubmit(onCreate)}
          loading={createCar.isPending}
          disabled={createCar.isPending}>
          Create car
        </Button>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 12,
  },
  subtitle: {
    opacity: 0.7,
  },
  input: {
    width: '100%',
  },
  errorText: {
    color: '#d32f2f',
    marginTop: -6,
  },
});
