import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card } from 'react-native-paper';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppStore } from '@/lib/stores/use-app-store';

export default function CurrentCarServiceScreen() {
  const { id: carId } = useLocalSearchParams<{ id: string }>();
  const allServiceRecords = useAppStore((state) => state.serviceRecords);
  const serviceRecords = useMemo(
    () =>
      allServiceRecords
        .filter((r) => r.carId === carId)
        .sort((a, b) => Number(b.id) - Number(a.id)),
    [allServiceRecords, carId],
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title">Service</ThemedText>
        <ThemedText style={styles.subtitle}>Запланированные и выполненные работы.</ThemedText>

        <Button
          mode="contained"
          onPress={() => router.push(`/(tabs)/main/current-car/${carId}/add-service`)}
          style={styles.addButton}>
          Add
        </Button>

        {serviceRecords.length === 0 ? (
          <ThemedText style={styles.empty}>Пока нет записей. Нажмите Add, чтобы добавить.</ThemedText>
        ) : (
          <View style={styles.list}>
            {serviceRecords.map((record) => (
              <Card
                key={record.id}
                mode="outlined"
                style={styles.card}
                onPress={() => router.push(`/(tabs)/main/current-car/${carId}/service-record/${record.id}`)}>
                <Card.Content>
                  <ThemedText type="defaultSemiBold">Пробег: {record.mileage.toLocaleString()} км</ThemedText>
                  <ThemedText style={styles.cardDescription}>{record.description}</ThemedText>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 24,
    gap: 12,
    paddingBottom: 40,
  },
  subtitle: {
    opacity: 0.7,
  },
  addButton: {
    alignSelf: 'flex-start',
  },
  empty: {
    opacity: 0.65,
    marginTop: 8,
  },
  list: {
    gap: 12,
    marginTop: 8,
  },
  card: {
    width: '100%',
  },
  cardDescription: {
    marginTop: 8,
    opacity: 0.85,
  },
});
