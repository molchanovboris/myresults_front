import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { apiAssetUrl } from '@/lib/api';
import type { ApiServiceInvoice } from '@/lib/types';

type InvoiceSlotsProps = {
  invoices: ApiServiceInvoice[];
  maxCount: number;
  disabled?: boolean;
  onAdd: () => void;
  onOpen: (invoice: ApiServiceInvoice) => void;
};

export function InvoiceSlots({ invoices, maxCount, disabled = false, onAdd, onOpen }: InvoiceSlotsProps) {
  return (
    <View style={styles.slots}>
      {Array.from({ length: maxCount }, (_, index) => {
        const invoice = invoices[index];
        if (!invoice) {
          return (
            <Pressable
              key={`empty-${index}`}
              style={styles.slot}
              onPress={onAdd}
              disabled={disabled}
              accessibilityLabel="Добавить фото счёта">
              <ThemedText style={styles.plus}>+</ThemedText>
            </Pressable>
          );
        }

        return (
          <Pressable key={invoice.id} onPress={() => onOpen(invoice)} accessibilityLabel="Открыть фото счёта">
            <Image source={{ uri: apiAssetUrl(invoice.url) }} style={styles.thumb} contentFit="cover" />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  slots: {
    flexDirection: 'row',
    gap: 12,
  },
  slot: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(127, 127, 127, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    fontSize: 24,
    lineHeight: 28,
  },
  thumb: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
});
