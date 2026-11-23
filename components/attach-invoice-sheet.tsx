import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';
import { Alert, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

import { ThemedText } from '@/components/themed-text';
import type { InvoiceAttachment } from '@/lib/types';

type AttachInvoiceSheetProps = {
  visible: boolean;
  remaining: number;
  onDismiss: () => void;
  onAttachment: (files: InvoiceAttachment[]) => void;
};

export function AttachInvoiceSheet({ visible, remaining, onDismiss, onAttachment }: AttachInvoiceSheetProps) {
  const theme = useTheme();

  const finishPick = useCallback(
    (files: InvoiceAttachment[]) => {
      if (files.length === 0) return;
      onAttachment(files.slice(0, Math.max(remaining, 0)));
      onDismiss();
    },
    [onAttachment, onDismiss, remaining],
  );

  const pickFromCamera = useCallback(async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Недоступно', 'Камера на веб-версии не поддерживается. Выберите фото из галереи.');
      return;
    }
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Нет доступа', 'Разрешите использование камеры в настройках.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.85,
      });
      if (result.canceled || !result.assets?.[0]) {
        return;
      }
      const asset = result.assets[0];
      const name = asset.fileName ?? `invoice-${Date.now()}.jpg`;
      finishPick([{ uri: asset.uri, name, mimeType: asset.mimeType ?? 'image/jpeg' }]);
    } catch (e) {
      Alert.alert('Ошибка', e instanceof Error ? e.message : 'Не удалось открыть камеру');
    }
  }, [finishPick]);

  const pickFromLibrary = useCallback(async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Нет доступа', 'Разрешите доступ к фото в настройках.');
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: remaining > 1,
        selectionLimit: Math.max(remaining, 1),
        quality: 0.85,
      });
      if (result.canceled || !result.assets?.length) {
        return;
      }
      finishPick(
        result.assets.map((asset, index) => ({
          uri: asset.uri,
          name: asset.fileName ?? `invoice-${Date.now()}-${index}.jpg`,
          mimeType: asset.mimeType ?? 'image/jpeg',
        })),
      );
    } catch (e) {
      Alert.alert('Ошибка', e instanceof Error ? e.message : 'Не удалось открыть галерею');
    }
  }, [finishPick]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onDismiss} accessibilityRole="button" />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.surface,
              borderTopColor: theme.colors.outlineVariant,
            },
          ]}>
        <ThemedText type="subtitle" style={styles.title}>
          Прикрепить счёт
        </ThemedText>
        <ThemedText style={styles.hint}>Сфотографируйте счёт или выберите фото из галереи.</ThemedText>
        {Platform.OS !== 'web' ? (
          <Button mode="contained-tonal" onPress={pickFromCamera} style={styles.btn}>
            Сделать фото
          </Button>
        ) : null}
        <Button mode="contained-tonal" onPress={pickFromLibrary} style={styles.btn}>
          Выбрать из галереи
        </Button>
        <Button mode="text" onPress={onDismiss} style={styles.btn}>
          Отмена
        </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.select({ ios: 34, default: 24 }),
    gap: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    marginBottom: 4,
  },
  hint: {
    opacity: 0.7,
    marginBottom: 8,
  },
  btn: {
    width: '100%',
  },
});
