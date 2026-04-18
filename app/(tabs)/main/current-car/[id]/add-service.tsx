import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppStore } from '@/lib/stores/use-app-store';

type AddServiceFormValues = {
  mileage: string;
  description: string;
};

export default function AddServiceScreen() {
  const { id: carId } = useLocalSearchParams<{ id: string }>();
  const addServiceRecord = useAppStore((state) => state.addServiceRecord);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AddServiceFormValues>({
    mode: 'onChange',
    defaultValues: {
      mileage: '',
      description: '',
    },
  });

  const onSchedule = ({ mileage, description }: AddServiceFormValues) => {
    if (!carId) {
      return;
    }
    addServiceRecord({
      carId,
      mileage: Number(mileage),
      description: description.trim(),
    });
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <Controller
          control={control}
          name="mileage"
          rules={{
            required: 'Укажите пробег',
            validate: (value) => {
              const n = Number(value);
              if (!Number.isFinite(n) || n < 0) {
                return 'Пробег должен быть неотрицательным числом';
              }
              if (!Number.isInteger(n)) {
                return 'Пробег укажите целым числом';
              }
              return true;
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Пробег"
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
          name="description"
          rules={{
            required: 'Опишите работы',
            minLength: { value: 3, message: 'Минимум 3 символа' },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Описание работ"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={[styles.input, styles.multiline]}
              error={!!errors.description}
            />
          )}
        />
        {errors.description ? (
          <ThemedText style={styles.errorText}>{errors.description.message}</ThemedText>
        ) : null}

        <Button mode="contained" onPress={handleSubmit(onSchedule)} disabled={!isValid}>
          Запланировать
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
  input: {
    width: '100%',
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#d32f2f',
    marginTop: -4,
  },
});
