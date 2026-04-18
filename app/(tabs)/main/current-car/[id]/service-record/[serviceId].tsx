import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Chip } from 'react-native-paper';

import { AttachInvoiceSheet } from '@/components/attach-invoice-sheet';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { InvoiceAttachment } from '@/lib/types';
import { useAppStore } from '@/lib/stores/use-app-store';

export default function ServiceRecordScreen() {
  const { id: carId, serviceId } = useLocalSearchParams<{ id: string; serviceId: string }>();
  const record = useAppStore((state) =>
    state.serviceRecords.find((item) => item.id === serviceId && item.carId === carId),
  );

  const [attachSheetVisible, setAttachSheetVisible] = useState(false);
  const [invoice, setInvoice] = useState<InvoiceAttachment | null>(null);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title">Запись сервиса</ThemedText>
        {record ? (
          <>
            <ThemedText type="defaultSemiBold">Пробег: {record.mileage.toLocaleString()} км</ThemedText>
            <ThemedText style={styles.description}>{record.description}</ThemedText>
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
        ) : (
          <ThemedText style={styles.description}>Запись не найдена.</ThemedText>
        )}
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
});
