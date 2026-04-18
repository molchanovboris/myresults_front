import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppStore } from '@/lib/stores/use-app-store';

type NewCarFormValues = {
  vin: string;
  manufacturer: string;
  model: string;
  year: string;
};

export default function NewCarScreen() {
  const addCar = useAppStore((state) => state.addCar);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<NewCarFormValues>({
    mode: 'onChange',
    defaultValues: {
      vin: '',
      manufacturer: '',
      model: '',
      year: '',
    },
  });

  const onCreateCar = ({ vin, manufacturer, model, year }: NewCarFormValues) => {
    addCar({
      vin: vin.trim().toUpperCase(),
      manufacturer: manufacturer.trim(),
      model: model.trim(),
      year: Number(year),
    });
    router.replace('/(tabs)/main');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title">New car</ThemedText>
        <ThemedText style={styles.subtitle}>Fill all fields to create a new car.</ThemedText>

        <Controller
          control={control}
          name="vin"
          rules={{
            required: 'VIN is required',
            minLength: { value: 11, message: 'VIN should contain at least 11 characters' },
            maxLength: { value: 17, message: 'VIN should contain at most 17 characters' },
            pattern: { value: /^[A-HJ-NPR-Z0-9]+$/i, message: 'VIN has invalid characters' },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="VIN"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="characters"
              mode="outlined"
              style={styles.input}
              error={!!errors.vin}
            />
          )}
        />
        {errors.vin ? <ThemedText style={styles.errorText}>{errors.vin.message}</ThemedText> : null}

        <Controller
          control={control}
          name="manufacturer"
          rules={{ required: 'Manufacturer is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Manufacturer (English)"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="words"
              mode="outlined"
              style={styles.input}
              error={!!errors.manufacturer}
            />
          )}
        />
        {errors.manufacturer ? (
          <ThemedText style={styles.errorText}>{errors.manufacturer.message}</ThemedText>
        ) : null}

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
            required: 'Year is required',
            validate: (value) => {
              const yearValue = Number(value);
              const currentYear = new Date().getFullYear() + 1;

              if (!Number.isInteger(yearValue)) {
                return 'Year must be a whole number';
              }

              if (yearValue < 1900 || yearValue > currentYear) {
                return `Year must be between 1900 and ${currentYear}`;
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

        <Button mode="contained" onPress={handleSubmit(onCreateCar)} disabled={!isValid}>
          Create car
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
    gap: 10,
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
    marginTop: -4,
  },
});
