import { useMutation } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import { AttachInvoiceSheet } from '@/components/attach-invoice-sheet';
import { InvoiceSlots } from '@/components/invoice-slots';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ScreenTitle } from '@/components/ui/screen-title';
import { createServiceInvoice, deleteServiceInvoice } from '@/features/service-records';
import { apiAssetUrl } from '@/lib/api';
import { useService } from '@/lib/hooks/use-services';
import { queryClient } from '@/lib/query-client';
import { useAppStore } from '@/lib/stores/use-app-store';
import type { ApiServiceInvoice, InvoiceAttachment } from '@/lib/types';

const MAX_INVOICES = 2;

export default function ServiceRecordScreen() {
  const params = useLocalSearchParams<{ id: string; serviceId: string }>();
  const carId = Array.isArray(params.id) ? params.id[0] : params.id;
  const serviceId = Array.isArray(params.serviceId) ? params.serviceId[0] : params.serviceId;
  const token = useAppStore((state) => state.token);
  const { data, isPending, isError, error } = useService(carId, serviceId);
  const record = data?.service;
  const invoices = record?.invoices ?? [];

  const [attachSheetVisible, setAttachSheetVisible] = useState(false);
  const [preview, setPreview] = useState<ApiServiceInvoice | null>(null);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['services', token, carId, serviceId] });
  };

  const addInvoice = useMutation({
    mutationFn: (file: InvoiceAttachment) =>
      createServiceInvoice(carId!, serviceId!, {
        uri: file.uri,
        name: file.name,
        mimeType: file.mimeType ?? 'image/jpeg',
      }),
    onSuccess: refresh,
  });

  const uploadInvoices = async (files: InvoiceAttachment[]) => {
    for (const file of files) {
      await addInvoice.mutateAsync(file);
    }
  };

  const removeInvoice = useMutation({
    mutationFn: (invoiceId: string) => deleteServiceInvoice(carId!, serviceId!, invoiceId),
    onSuccess: refresh,
  });

  const confirmDelete = (invoice: ApiServiceInvoice) => {
    Alert.alert('Удалить фото', 'Удалить это фото счёта?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: () => {
          setPreview(null);
          removeInvoice.mutate(invoice.id);
        },
      },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenTitle>Запись сервиса</ScreenTitle>
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
            <View style={styles.attachmentRow}>
              <ThemedText style={styles.attachmentLabel}>Прикреплённый счёт:</ThemedText>
              <InvoiceSlots
                invoices={invoices}
                maxCount={MAX_INVOICES}
                disabled={addInvoice.isPending || !carId || !serviceId}
                onAdd={() => setAttachSheetVisible(true)}
                onOpen={setPreview}
              />
            </View>
            {addInvoice.error ? <ThemedText style={styles.errorText}>{addInvoice.error.message}</ThemedText> : null}
            {removeInvoice.error ? <ThemedText style={styles.errorText}>{removeInvoice.error.message}</ThemedText> : null}
          </>
        ) : !isPending && !isError ? (
          <ThemedText style={styles.description}>Запись не найдена.</ThemedText>
        ) : null}
      </ScrollView>

      <AttachInvoiceSheet
        visible={attachSheetVisible}
        remaining={MAX_INVOICES - invoices.length}
        onDismiss={() => setAttachSheetVisible(false)}
        onAttachment={(files) => {
          uploadInvoices(files).catch(() => undefined);
        }}
      />

      <Modal visible={preview != null} transparent animationType="fade" onRequestClose={() => setPreview(null)}>
        <View style={styles.previewRoot}>
          <Pressable style={styles.previewBackdrop} onPress={() => setPreview(null)} />
          {preview ? (
            <Image source={{ uri: apiAssetUrl(preview.url) }} style={styles.previewImage} contentFit="contain" />
          ) : null}
          <View style={styles.previewActions}>
            <Button mode="text" textColor="#fff" onPress={() => setPreview(null)}>
              Закрыть
            </Button>
            {preview ? (
              <Button
                mode="text"
                textColor="#ff8a80"
                disabled={removeInvoice.isPending}
                onPress={() => confirmDelete(preview)}>
                Удалить
              </Button>
            ) : null}
          </View>
        </View>
      </Modal>
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
    paddingBottom: 40,
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
  previewRoot: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  previewBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
  },
  previewImage: {
    width: '100%',
    height: '75%',
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorText: {
    color: '#d32f2f',
  },
});
