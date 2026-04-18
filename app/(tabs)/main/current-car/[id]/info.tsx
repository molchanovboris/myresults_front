import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppStore } from '@/lib/stores/use-app-store';

export default function CurrentCarInfoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const car = useAppStore((state) => state.cars.find((item) => item.id === id));

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        {car ? (
          <>
            <ThemedText type="title">Car details</ThemedText>
            <ThemedText type="subtitle">
              {car.manufacturer} {car.model}
            </ThemedText>
            <ThemedText style={styles.subtitle}>VIN: {car.vin}</ThemedText>
            <ThemedText style={styles.subtitle}>Year: {car.year}</ThemedText>
          </>
        ) : (
          <ThemedText style={styles.subtitle}>Car not found for id: {id}</ThemedText>
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
    alignItems: 'center',
    padding: 24,
    gap: 8,
  },
  subtitle: {
    opacity: 0.8,
  },
});
