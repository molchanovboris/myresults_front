import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useCars } from '@/lib/hooks/use-cars';
import type { ApiCar } from '@/lib/types';

function carLabel(car: ApiCar) {
  const name = `${car.make} ${car.model}`;
  return car.year != null ? `${name} · ${car.year}` : name;
}

export default function HomeScreen() {
  const { data, isPending, isError, error } = useCars();
  const cars = data?.cars ?? [];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title">My cars</ThemedText>
        {isPending ? <ThemedText style={styles.emptyText}>Loading cars…</ThemedText> : null}
        {isError ? (
          <ThemedText style={styles.errorText}>{error?.message ?? 'Could not load cars'}</ThemedText>
        ) : null}
        {!isPending && !isError && cars.length === 0 ? (
          <ThemedText style={styles.emptyText}>No cars yet.</ThemedText>
        ) : null}
        {cars.map((car) => (
          <Button
            key={car.id}
            mode="outlined"
            onPress={() => router.push(`/(tabs)/main/current-car/${car.id}`)}
            style={styles.itemButton}>
            {carLabel(car)}
          </Button>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 24,
    padding: 24,
    gap: 12,
  },
  itemButton: {
    width: '100%',
  },
  emptyText: {
    opacity: 0.7,
  },
  errorText: {
    color: '#d32f2f',
  },
});
