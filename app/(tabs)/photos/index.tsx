import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ScreenTitle } from '@/components/ui/screen-title';
import { apiAssetUrl } from '@/lib/api';
import { useCars } from '@/lib/hooks/use-cars';
import { usePhotos } from '@/lib/hooks/use-photos';
import type { ApiCar } from '@/lib/types';

function carLabel(car: ApiCar) {
  const name = `${car.make} ${car.model}`;
  return car.year != null ? `${name} · ${car.year}` : name;
}

function CarPhotoCard({ car }: { car: ApiCar }) {
  const { data } = usePhotos(car.id);
  const cover = data?.photos[0];

  return (
    <Pressable
      onPress={() => router.push(`/(tabs)/photos/${car.id}`)}
      style={styles.card}>
      {cover ? (
        <Image source={{ uri: apiAssetUrl(cover.url) }} style={styles.photo} contentFit="cover" />
      ) : (
        <View style={[styles.photo, styles.placeholder]}>
          <ThemedText style={styles.muted}>No photo</ThemedText>
        </View>
      )}
      <ThemedText type="defaultSemiBold">{carLabel(car)}</ThemedText>
    </Pressable>
  );
}

export default function PhotosScreen() {
  const { data, isPending, isError, error } = useCars();
  const cars = data?.cars ?? [];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenTitle>Photos</ScreenTitle>
        {isPending ? <ThemedText style={styles.muted}>Loading cars…</ThemedText> : null}
        {isError ? (
          <ThemedText style={styles.errorText}>{error?.message ?? 'Could not load cars'}</ThemedText>
        ) : null}
        {!isPending && !isError && cars.length === 0 ? (
          <ThemedText style={styles.muted}>No cars yet.</ThemedText>
        ) : null}
        {cars.map((car) => (
          <CarPhotoCard key={car.id} car={car} />
        ))}
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
    gap: 16,
  },
  card: {
    gap: 8,
  },
  photo: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(127, 127, 127, 0.15)',
  },
  muted: {
    opacity: 0.7,
  },
  errorText: {
    color: '#d32f2f',
  },
});
