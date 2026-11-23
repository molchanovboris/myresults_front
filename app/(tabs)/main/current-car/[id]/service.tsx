import { useMutation } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/app-button';
import { ScreenTitle } from '@/components/ui/screen-title';
import { fetchCarAdvice } from '@/features/service-records';
import { useCar } from '@/lib/hooks/use-car';
import { useServices } from '@/lib/hooks/use-services';

export default function CurrentCarServiceScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const carId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data, isPending, isError, error } = useServices(carId);
  const { data: carData } = useCar(carId);
  const serviceRecords = data?.services ?? [];
  const currentMileage = carData?.car.mileage;
  const advice = useMutation({
    mutationFn: () => fetchCarAdvice(carId!),
  });

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.titleRow}>
          <ScreenTitle style={styles.title}>Service</ScreenTitle>
          <AppButton
            compact
            onPress={() => advice.mutate()}
            loading={advice.isPending}
            disabled={!carId || advice.isPending}>
            Advice
          </AppButton>
        </View>
        <ThemedText style={styles.subtitle}>
          Mileage: {currentMileage != null ? `${currentMileage.toLocaleString('en-US')} km` : '—'}
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Total: {data != null ? data.totalCost.toLocaleString('en-US') : '—'}
        </ThemedText>
        {advice.data ? <ThemedText style={styles.advice}>{advice.data.advice}</ThemedText> : null}
        {advice.error ? <ThemedText style={styles.errorText}>{advice.error.message}</ThemedText> : null}

        <AppButton
          onPress={() => router.push(`/(tabs)/main/current-car/${carId}/add-service`)}
          style={styles.addButton}>
          Add
        </AppButton>

        {isPending ? <ThemedText style={styles.empty}>Loading services…</ThemedText> : null}
        {isError ? <ThemedText style={styles.errorText}>{error?.message ?? 'Could not load services'}</ThemedText> : null}
        {!isPending && !isError && serviceRecords.length === 0 ? (
          <ThemedText style={styles.empty}>Пока нет записей. Нажмите Add, чтобы добавить.</ThemedText>
        ) : null}
        {serviceRecords.length > 0 ? (
          <View style={styles.list}>
            {serviceRecords.map((record) => (
              <Card
                key={record.id}
                mode="outlined"
                style={styles.card}
                onPress={() => router.push(`/(tabs)/main/current-car/${carId}/service-record/${record.id}`)}>
                <Card.Content>
                  <ThemedText type="defaultSemiBold">{record.title}</ThemedText>
                  {record.mileage != null ? (
                    <ThemedText style={styles.cardDescription}>
                      {record.mileage.toLocaleString('en-US')} km
                    </ThemedText>
                  ) : null}
                  {record.cost != null ? (
                    <ThemedText style={styles.cardDescription}>{record.cost.toLocaleString('en-US')}</ThemedText>
                  ) : null}
                </Card.Content>
              </Card>
            ))}
          </View>
        ) : null}
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    flex: 1,
  },
  subtitle: {
    opacity: 0.7,
  },
  advice: {
    lineHeight: 22,
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
  errorText: {
    color: '#d32f2f',
  },
});
