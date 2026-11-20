import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/app-button';
import { ScreenTitle } from '@/components/ui/screen-title';
import { deleteCar } from '@/features/cars';
import { useCars } from '@/lib/hooks/use-cars';
import { queryClient } from '@/lib/query-client';
import { useAppStore } from '@/lib/stores/use-app-store';
import type { ApiCar, CarListResponse } from '@/lib/types';

function carLabel(car: ApiCar) {
  const name = `${car.make} ${car.model}`;
  return car.year != null ? `${name} · ${car.year}` : name;
}

export default function HomeScreen() {
  const { data, isPending, isError, error } = useCars();
  const cars = data?.cars ?? [];
  const removeCar = useMutation({
    mutationFn: (carId: string) => deleteCar(carId),
    onSuccess: (_result, carId) => {
      const token = useAppStore.getState().token;
      queryClient.setQueryData<CarListResponse>(['cars', token], (current) =>
        current ? { cars: current.cars.filter((item) => item.id !== carId) } : current
      );
      queryClient.removeQueries({ queryKey: ['cars', token, carId] });
    },
  });

  const confirmDelete = (car: ApiCar) => {
    Alert.alert('Delete car', `Delete ${carLabel(car)}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => removeCar.mutate(car.id),
      },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ScreenTitle>My cars</ScreenTitle>
        {isPending ? <ThemedText style={styles.emptyText}>Loading cars…</ThemedText> : null}
        {isError ? (
          <ThemedText style={styles.errorText}>{error?.message ?? 'Could not load cars'}</ThemedText>
        ) : null}
        {!isPending && !isError && cars.length === 0 ? (
          <ThemedText style={styles.emptyText}>No cars yet.</ThemedText>
        ) : null}
        {removeCar.error ? <ThemedText style={styles.errorText}>{removeCar.error.message}</ThemedText> : null}
        {cars.map((car) => (
          <View key={car.id} style={styles.row}>
            <AppButton
              variant="secondary"
              onPress={() => router.push(`/(tabs)/main/current-car/${car.id}`)}
              style={styles.itemButton}>
              {carLabel(car)}
            </AppButton>
            <Button
              mode="text"
              textColor="#d32f2f"
              onPress={() => confirmDelete(car)}
              disabled={removeCar.isPending}
              loading={removeCar.isPending && removeCar.variables === car.id}>
              Delete
            </Button>
          </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemButton: {
    flex: 1,
  },
  emptyText: {
    opacity: 0.7,
  },
  errorText: {
    color: '#d32f2f',
  },
});
