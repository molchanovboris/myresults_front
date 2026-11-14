import { Image } from 'expo-image';
import { Link, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { apiAssetUrl } from '@/lib/api';
import { useCar } from '@/lib/hooks/use-car';

function Field({ label, value }: { label: string; value: string | number | null }) {
  return (
    <View style={styles.field}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <ThemedText type="subtitle">{value ?? '—'}</ThemedText>
    </View>
  );
}

export default function CurrentCarHubScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data, isPending, isError, error } = useCar(id);
  const car = data?.car;
  const photoUrl = data?.photos[0]?.url;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {isPending ? <ThemedText style={styles.muted}>Loading car…</ThemedText> : null}
        {isError ? (
          <ThemedText style={styles.errorText}>{error?.message ?? 'Could not load car'}</ThemedText>
        ) : null}
        {car ? (
          <>
            <Field label="Make" value={car.make} />
            <Field label="Model" value={car.model} />
            <Field label="Year" value={car.year} />
            <Field label="Color" value={car.color} />
            <Field label="Mileage" value={car.mileage} />
            {photoUrl ? (
              <Image source={{ uri: apiAssetUrl(photoUrl) }} style={styles.photo} contentFit="cover" />
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
});
