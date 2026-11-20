import { useMutation } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Button, SegmentedButtons } from 'react-native-paper';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/app-button';
import { AppTextArea } from '@/components/ui/app-text-area';
import { AppTextField } from '@/components/ui/app-text-field';
import { queryClient } from '@/lib/query-client';
import { createService } from '@/features/service-records';
import { useAppStore } from '@/lib/stores/use-app-store';
import type { ServiceKind } from '@/lib/types';

type ServiceItemForm = {
  name: string;
  price: string;
  quantity: string;
};

type AddServiceFormValues = {
  mileage: string;
  laborCost: string;
  repair: string;
  items: ServiceItemForm[];
};

const emptyItem = (): ServiceItemForm => ({ name: '', price: '', quantity: '1' });

function digitsOnly(value: string) {
  return value.replace(/\D/g, '').slice(0, 2);
}

function moneyText(value: string) {
  const cleaned = value.replace(/[^\d.]/g, '');
  const [whole, ...fraction] = cleaned.split('.');
  if (fraction.length === 0) return whole;
  return `${whole}.${fraction.join('').slice(0, 2)}`;
}

function serviceTitle(kind: ServiceKind, mileage: string, repair: string) {
  const mileageNumber = Number(mileage);
  if (!Number.isInteger(mileageNumber) || mileageNumber < 0) return null;
  const formatted = new Intl.NumberFormat('en-US').format(mileageNumber);
  if (kind === 'maintenance') return `Service at ${formatted} km`;
  return repair.trim() ? `Repair ${repair.trim()}` : null;
}

export default function AddServiceScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const carId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [kind, setKind] = useState<ServiceKind>('maintenance');
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddServiceFormValues>({
    mode: 'onChange',
    defaultValues: {
      mileage: '',
      laborCost: '',
      repair: '',
      items: [emptyItem()],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const mileage = watch('mileage');
  const repair = watch('repair');
  const preview = serviceTitle(kind, mileage, repair);

  const saveService = useMutation({
    mutationFn: (values: AddServiceFormValues) =>
      createService(carId!, {
        kind,
        mileage: Number(values.mileage),
        laborCost: Number(values.laborCost),
        ...(kind === 'repair' ? { repair: values.repair.trim() } : {}),
        items: values.items.map((item) => ({
          name: item.name.trim(),
          quantity: Number(item.quantity),
          price: Number(item.price),
        })),
      }),
    onSuccess: () => {
      const token = useAppStore.getState().token;
      queryClient.invalidateQueries({ queryKey: ['services', token, carId] });
      router.back();
    },
  });

  const onSave = (values: AddServiceFormValues) => {
    if (!carId) return;
    saveService.mutate(values);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <SegmentedButtons
          value={kind}
          onValueChange={(value) => setKind(value as ServiceKind)}
          buttons={[
            { value: 'maintenance', label: 'Service' },
            { value: 'repair', label: 'Repair' },
          ]}
        />

        <Controller
          control={control}
          name="mileage"
          rules={{
            required: 'Mileage is required',
            validate: (value) => {
              const mileageNumber = Number(value);
              if (!Number.isInteger(mileageNumber) || mileageNumber < 0) {
                return 'Mileage must be a whole number from 0';
              }
              return true;
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextField
              label="Mileage"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="number-pad"
              error={!!errors.mileage}
            />
          )}
        />
        {errors.mileage ? <ThemedText style={styles.errorText}>{errors.mileage.message}</ThemedText> : null}

        <Controller
          control={control}
          name="laborCost"
          rules={{
            required: 'Labor cost is required',
            validate: (value) => (/^\d+(\.\d{1,2})?$/.test(value) ? true : 'Enter a labor cost'),
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextField
              label="Labor cost"
              value={value}
              onChangeText={(next) => onChange(moneyText(next))}
              onBlur={onBlur}
              keyboardType="decimal-pad"
              error={!!errors.laborCost}
            />
          )}
        />
        {errors.laborCost ? <ThemedText style={styles.errorText}>{errors.laborCost.message}</ThemedText> : null}

        {kind === 'repair' ? (
          <>
            <Controller
              control={control}
              name="repair"
              rules={{
                required: 'Describe what was repaired',
                minLength: { value: 2, message: 'Describe what was repaired' },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AppTextField
                  label="What was repaired"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.repair}
                />
              )}
            />
            {errors.repair ? <ThemedText style={styles.errorText}>{errors.repair.message}</ThemedText> : null}
          </>
        ) : null}

        {fields.map((field, index) => {
          const itemErrors = errors.items?.[index];
          return (
            <View key={field.id} style={styles.itemCard}>
              <Controller
                control={control}
                name={`items.${index}.name`}
                rules={{ required: index === 0 ? 'Name is required' : 'Name is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppTextArea
                    label="Name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={!!itemErrors?.name}
                  />
                )}
              />
              {itemErrors?.name ? <ThemedText style={styles.errorText}>{itemErrors.name.message}</ThemedText> : null}
              <View style={styles.itemNumbers}>
                <Controller
                  control={control}
                  name={`items.${index}.price`}
                  rules={{
                    required: 'Price is required',
                    validate: (value) => {
                      if (!/^\d+(\.\d{1,2})?$/.test(value)) return 'Enter a price';
                      return true;
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextField
                      label="Price"
                      value={value}
                      onChangeText={(next) => onChange(moneyText(next))}
                      onBlur={onBlur}
                      keyboardType="decimal-pad"
                      style={styles.smallInput}
                      error={!!itemErrors?.price}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`items.${index}.quantity`}
                  rules={{
                    required: 'Quantity is required',
                    validate: (value) => {
                      const quantity = Number(value);
                      if (!/^\d+$/.test(value) || quantity < 1 || quantity > 20) {
                        return 'Quantity must be from 1 to 20';
                      }
                      return true;
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextField
                      label="Quantity"
                      value={value}
                      onChangeText={(next) => onChange(digitsOnly(next))}
                      onBlur={onBlur}
                      keyboardType="number-pad"
                      style={styles.smallInput}
                      error={!!itemErrors?.quantity}
                    />
                  )}
                />
              </View>
              {itemErrors?.price ? <ThemedText style={styles.errorText}>{itemErrors.price.message}</ThemedText> : null}
              {itemErrors?.quantity ? (
                <ThemedText style={styles.errorText}>{itemErrors.quantity.message}</ThemedText>
              ) : null}
              {index > 0 ? (
                <Button mode="text" textColor="#d32f2f" onPress={() => remove(index)}>
                  Remove
                </Button>
              ) : null}
            </View>
          );
        })}

        <AppButton variant="secondary" onPress={() => append(emptyItem())}>
          Add
        </AppButton>

        {preview ? <ThemedText style={styles.preview}>{preview}</ThemedText> : null}
        {saveService.error ? <ThemedText style={styles.errorText}>{saveService.error.message}</ThemedText> : null}

        <AppButton
          onPress={handleSubmit(onSave)}
          loading={saveService.isPending}
          disabled={saveService.isPending}>
          Save
        </AppButton>
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
    paddingBottom: 40,
  },
  itemCard: {
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(127, 127, 127, 0.4)',
  },
  itemNumbers: {
    flexDirection: 'row',
    gap: 8,
  },
  smallInput: {
    flex: 1,
  },
  preview: {
    opacity: 0.75,
  },
  errorText: {
    color: '#d32f2f',
    marginTop: -6,
  },
});
