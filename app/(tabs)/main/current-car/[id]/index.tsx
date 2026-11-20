import { useTheme } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Link, useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppTextField } from '@/components/ui/app-text-field';
import { apiAssetUrl } from '@/lib/api';
import { updateCar } from '@/features/cars';
import { useCar } from '@/lib/hooks/use-car';
import { queryClient } from '@/lib/query-client';
import { useAppStore } from '@/lib/stores/use-app-store';
import type { CarDetailsResponse } from '@/lib/types';

function Field({ label, value }: { label: string; value: string | number | null }) {
  return (
    <View style={styles.field}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <ThemedText type="subtitle">{value ?? '—'}</ThemedText>
    </View>
  );
}

export default function CurrentCarHubScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data, isPending, isError, error } = useCar(id);
  const car = data?.car;
  const imageUrl = data?.image?.url;
  const [editing, setEditing] = useState(false);
  const [color, setColor] = useState('');
  const [mileage, setMileage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const saveCar = useMutation({
    mutationFn: () =>
      updateCar(id!, {
        color: color.trim() ? color.trim() : null,
        mileage: Number(mileage),
      }),
    onSuccess: (updated) => {
      const token = useAppStore.getState().token;
      queryClient.setQueryData<CarDetailsResponse>(['cars', token, id], (current) => ({
        car: updated.car,
        image: updated.image !== undefined ? updated.image : (current?.image ?? null),
      }));
      queryClient.invalidateQueries({ queryKey: ['cars', token], exact: true });
      setEditing(false);
      setFormError(null);
    },
  });

  const actions = useRef({ startEdit: () => {}, save: () => {} });
  actions.current.startEdit = () => {
    if (!car) return;
    setColor(car.color ?? '');
    setMileage(car.mileage != null ? String(car.mileage) : '');
    setFormError(null);
    saveCar.reset();
    setEditing(true);
  };
  actions.current.save = () => {
    if (!/^\d+$/.test(mileage.trim())) {
      setFormError('Mileage must be a whole number');
      return;
    }
    if (car?.mileage != null && Number(mileage) < car.mileage) {
      setFormError(`Mileage cannot be less than ${car.mileage}`);
      return;
    }
    setFormError(null);
    saveCar.mutate();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => (editing ? actions.current.save() : actions.current.startEdit())}
          disabled={saveCar.isPending || !car}
          style={styles.headerButton}>
          <Text style={{ color: theme.colors.primary, fontSize: 17 }}>
            {saveCar.isPending ? 'Saving…' : editing ? 'Save' : 'Edit'}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, editing, car, saveCar.isPending, theme.colors.primary]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {isPending ? <ThemedText style={styles.muted}>Loading car…</ThemedText> : null}
        {isError ? (
          <ThemedText style={styles.errorText}>{error?.message ?? 'Could not load car'}</ThemedText>
        ) : null}
        {car ? (
          <>
            <Field label="Make" value={car.make} />
            <Field label="Model" value={car.model} />
            <Field label="Year" value={car.year} />
            {editing ? (
              <AppTextField
                label="Color"
                value={color}
                onChangeText={setColor}
                autoCapitalize="words"
              />
            ) : (
              <Field label="Color" value={car.color} />
            )}
            {editing ? (
              <AppTextField
                label="Mileage"
                value={mileage}
                onChangeText={setMileage}
                keyboardType="number-pad"
              />
            ) : (
              <Field label="Mileage" value={car.mileage} />
            )}
            {formError ? <ThemedText style={styles.errorText}>{formError}</ThemedText> : null}
            {saveCar.error ? <ThemedText style={styles.errorText}>{saveCar.error.message}</ThemedText> : null}
            {imageUrl ? (
              <Image key={imageUrl} source={{ uri: apiAssetUrl(imageUrl) }} style={styles.photo} contentFit="cover" />
            ) : (
              <View style={[styles.photo, styles.photoPlaceholder]}>
                <ThemedText style={styles.muted}>No photo</ThemedText>
              </View>
            )}
            <Link href={`/(tabs)/main/current-car/${id}/service`} asChild>
              <Button mode="contained-tonal" style={styles.link}>
                Service
              </Button>
            </Link>
            <Link href={`/(tabs)/main/current-car/${id}/ideas`} asChild>
              <Button mode="contained-tonal" style={styles.link}>
                Ideas
              </Button>
            </Link>
          </>
        ) : null}
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
  field: {
    gap: 2,
  },
  label: {
    opacity: 0.6,
  },
  photo: {
    width: '100%',
    height: 220,
    borderRadius: 12,
  },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(127, 127, 127, 0.15)',
  },
  link: {
    width: '100%',
  },
  muted: {
    opacity: 0.7,
  },
  errorText: {
    color: '#d32f2f',
  },
  headerButton: {
    marginRight: 16,
  },
});
