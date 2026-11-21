import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/app-button';
import { AppTextArea } from '@/components/ui/app-text-area';
import { AppTextField } from '@/components/ui/app-text-field';

export type ServiceItemForm = {
  name: string;
  price: string;
  quantity: string;
};

type ServiceItemModalProps = {
  item: ServiceItemForm | null;
  title: string;
  onCancel: () => void;
  onConfirm: (item: ServiceItemForm) => void;
};

export function emptyServiceItem(): ServiceItemForm {
  return { name: '', price: '', quantity: '1' };
}

function itemDraftErrors(item: ServiceItemForm) {
  const next: { name?: string; price?: string; quantity?: string } = {};
  if (!item.name.trim()) next.name = 'Name is required';
  if (!/^\d+(\.\d{1,2})?$/.test(item.price)) next.price = 'Enter a price';
  const quantity = Number(item.quantity);
  if (!/^\d+$/.test(item.quantity) || quantity < 1 || quantity > 20) {
    next.quantity = 'Quantity must be from 1 to 20';
  }
  return next;
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, '').slice(0, 2);
}

function moneyText(value: string) {
  const cleaned = value.replace(/[^\d.]/g, '');
  const [whole, ...fraction] = cleaned.split('.');
  if (fraction.length === 0) return whole;
  return `${whole}.${fraction.join('').slice(0, 2)}`;
}

export function ServiceItemModal({ item, title, onCancel, onConfirm }: ServiceItemModalProps) {
  const insets = useSafeAreaInsets();
  const nameRef = useRef<{ focus: () => void } | null>(null);
  const [draft, setDraft] = useState<ServiceItemForm>(item ?? emptyServiceItem());
  const [draftErrors, setDraftErrors] = useState<ReturnType<typeof itemDraftErrors>>({});

  const confirm = () => {
    const nextErrors = itemDraftErrors(draft);
    setDraftErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onConfirm(draft);
  };

  return (
    <Modal
      visible={item != null}
      animationType="slide"
      transparent
      presentationStyle="overFullScreen"
      statusBarTranslucent
      onShow={() => nameRef.current?.focus()}
      onRequestClose={onCancel}>
      <View style={[styles.backdrop, { paddingTop: insets.top + 56 }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} accessibilityLabel="Close" />
        <ThemedView style={styles.sheet}>
          <KeyboardAvoidingView style={styles.popup} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={[styles.popupContent, { paddingBottom: insets.bottom + 20 }]}>
              <ThemedText type="subtitle">{title}</ThemedText>
              <AppTextArea
                ref={nameRef}
                label="Name"
                value={draft.name}
                onChangeText={(name) => setDraft((current) => ({ ...current, name }))}
                error={!!draftErrors.name}
              />
              {draftErrors.name ? <ThemedText style={styles.errorText}>{draftErrors.name}</ThemedText> : null}
              <View style={styles.itemNumbers}>
                <AppTextField
                  label="Price"
                  value={draft.price}
                  onChangeText={(price) => setDraft((current) => ({ ...current, price: moneyText(price) }))}
                  keyboardType="decimal-pad"
                  style={styles.smallInput}
                  error={!!draftErrors.price}
                />
                <AppTextField
                  label="Quantity"
                  value={draft.quantity}
                  onChangeText={(quantity) =>
                    setDraft((current) => ({ ...current, quantity: digitsOnly(quantity) }))
                  }
                  keyboardType="number-pad"
                  style={styles.smallInput}
                  error={!!draftErrors.quantity}
                />
              </View>
              {draftErrors.price ? <ThemedText style={styles.errorText}>{draftErrors.price}</ThemedText> : null}
              {draftErrors.quantity ? <ThemedText style={styles.errorText}>{draftErrors.quantity}</ThemedText> : null}
              <AppButton onPress={confirm}>OK</AppButton>
              <AppButton variant="secondary" onPress={onCancel}>
                Cancel
              </AppButton>
            </ScrollView>
          </KeyboardAvoidingView>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  sheet: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  popup: {
    flex: 1,
    width: '100%',
  },
  popupContent: {
    flexGrow: 1,
    paddingTop: 20,
    paddingHorizontal: 24,
    gap: 12,
  },
  itemNumbers: {
    flexDirection: 'row',
    gap: 8,
  },
  smallInput: {
    flex: 1,
  },
  errorText: {
    color: '#d32f2f',
    marginTop: -6,
  },
});
