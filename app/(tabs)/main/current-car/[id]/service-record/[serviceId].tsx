import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Chip } from 'react-native-paper';

import { AttachInvoiceSheet } from '@/components/attach-invoice-sheet';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { InvoiceAttachment } from '@/lib/types';
import { useService } from '@/lib/hooks/use-services';

export default function ServiceRecordScreen() {
  const params = useLocalSearchParams<{ id: string; serviceId: string }>();
  const carId = Array.isArray(params.id) ? params.id[0] : params.id;
  const serviceId = Array.isArray(params.serviceId) ? params.serviceId[0] : params.serviceId;
  const { data, isPending, isError, error } = useService(carId, serviceId);
  const record = data?.service;

  const [attachSheetVisible, setAttachSheetVisible] = useState(false);
  const [invoice, setInvoice] = useState<InvoiceAttachment | null>(null);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title">Запись сервиса</ThemedText>
        {isPending ? <ThemedText style={styles.description}>Loading service…</ThemedText> : null}
        {isError ? <ThemedText style={styles.errorText}>{error?.message ?? 'Could not load service'}</ThemedText> : null}
        {record ? (
          <>
            <ThemedText type="defaultSemiBold">{record.title}</ThemedText>
            {record.mileage != null ? (
              <ThemedText style={styles.description}>{record.mileage.toLocaleString('en-US')} km</ThemedText>
            ) : null}
            {record.laborCost != null ? (
              <ThemedText style={styles.description}>Labor: {record.laborCost.toLocaleString('en-US')}</ThemedText>
            ) : null}
            {record.cost != null ? (
              <ThemedText type="defaultSemiBold">Total: {record.cost.toLocaleString('en-US')}</ThemedText>
            ) : null}
            {record.items?.map((item) => (
              <View key={item.id} style={styles.item}>
                <ThemedText>{item.name}</ThemedText>
                <ThemedText style={styles.description}>
                  {item.quantity} × {item.price.toLocaleString('en-US')}
                </ThemedText>
              </View>
            ))}
            <Button mode="contained" onPress={() => setAttachSheetVisible(true)}>
              Добавить счёт
            </Button>
            {invoice ? (
              <View style={styles.attachmentRow}>
                <ThemedText style={styles.attachmentLabel}>Прикреплённый счёт:</ThemedText>
                <Chip icon="file-document" onClose={() => setInvoice(null)} style={styles.chip}>
                  {invoice.name}
                </Chip>
              </View>
            ) : null}
          </>
        ) : !isPending && !isError ? (
          <ThemedText style={styles.description}>Запись не найдена.</ThemedText>
        ) : null}
      </View>

      <AttachInvoiceSheet
        visible={attachSheetVisible}
        onDismiss={() => setAttachSheetVisible(false)}
        onAttachment={setInvoice}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 12,
  },
  description: {
    opacity: 0.8,
  },
  item: {
    gap: 2,
  },
  attachmentRow: {
    gap: 8,
    marginTop: 4,
  },
  attachmentLabel: {
    opacity: 0.75,
  },
  chip: {
    alignSelf: 'flex-start',
  },
  errorText: {
    color: '#d32f2f',
  },
});
