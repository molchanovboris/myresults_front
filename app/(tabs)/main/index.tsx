import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppStore } from '@/lib/stores/use-app-store';

export default function HomeScreen() {
  const cars = useAppStore((state) => state.cars);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title">My cars</ThemedText>
        {cars.length === 0 ? <ThemedText style={styles.emptyText}>No cars yet.</ThemedText> : null}
        {cars.map((car) => (
          <Button
            key={car.id}
            mode="outlined"
            onPress={() => router.push(`/(tabs)/main/current-car/${car.id}`)}
            style={styles.itemButton}>
            {car.manufacturer} {car.model}
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
});
