import { useMutation } from '@tanstack/react-query';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/app-button';
import { createPhoto, deletePhoto } from '@/features/photos';
import { apiAssetUrl } from '@/lib/api';
import { useCar } from '@/lib/hooks/use-car';
import { usePhotos } from '@/lib/hooks/use-photos';
import { queryClient } from '@/lib/query-client';
import { useAppStore } from '@/lib/stores/use-app-store';
import type { ApiCarPhoto } from '@/lib/types';

function invalidatePhotos(carId: string) {
  const token = useAppStore.getState().token;
  queryClient.invalidateQueries({ queryKey: ['photos', token, carId] });
  queryClient.invalidateQueries({ queryKey: ['cars', token, carId] });
}

export default function CarPhotosScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ carId: string }>();
  const carId = Array.isArray(params.carId) ? params.carId[0] : params.carId;
  const { data: carData } = useCar(carId);
  const { data, isPending, isError, error } = usePhotos(carId);
  const photos = data?.photos ?? [];
  const car = carData?.car;

  useLayoutEffect(() => {
    navigation.setOptions({ title: car ? `${car.make} ${car.model}` : 'Photos' });
  }, [navigation, car]);

  const addPhoto = useMutation({
    mutationFn: (file: { uri: string; name: string; mimeType: string }) => createPhoto(carId!, file),
    onSuccess: () => invalidatePhotos(carId!),
  });

  const removePhoto = useMutation({
    mutationFn: (photoId: string) => deletePhoto(carId!, photoId),
    onSuccess: () => invalidatePhotos(carId!),
  });

  const pickPhoto = async () => {
    if (Platform.OS !== 'web') {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Photos', 'Allow photo library access to add a picture.');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    const mimeType = asset.mimeType ?? 'image/jpeg';
    const extension = mimeType.split('/')[1] === 'jpeg' ? 'jpg' : (mimeType.split('/')[1] ?? 'jpg');
    addPhoto.mutate({
      uri: asset.uri,
      name: asset.fileName ?? `photo-${Date.now()}.${extension}`,
      mimeType,
    });
  };

  const confirmDelete = (photo: ApiCarPhoto) => {
    Alert.alert('Delete photo', 'Delete this photo?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removePhoto.mutate(photo.id) },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppButton onPress={pickPhoto} loading={addPhoto.isPending} disabled={addPhoto.isPending || !carId}>
          Add photo
        </AppButton>
        {addPhoto.error ? <ThemedText style={styles.errorText}>{addPhoto.error.message}</ThemedText> : null}
        {isPending ? <ThemedText style={styles.muted}>Loading photos…</ThemedText> : null}
        {isError ? (
          <ThemedText style={styles.errorText}>{error?.message ?? 'Could not load photos'}</ThemedText>
        ) : null}
        {!isPending && !isError && photos.length === 0 ? (
          <ThemedText style={styles.muted}>No photos yet.</ThemedText>
        ) : null}
        {removePhoto.error ? <ThemedText style={styles.errorText}>{removePhoto.error.message}</ThemedText> : null}
        {photos.map((photo) => (
          <View key={photo.id} style={styles.card}>
            <Image source={{ uri: apiAssetUrl(photo.url) }} style={styles.photo} contentFit="cover" />
            {photo.caption ? <ThemedText style={styles.muted}>{photo.caption}</ThemedText> : null}
            <Button
              mode="text"
              textColor="#d32f2f"
              onPress={() => confirmDelete(photo)}
              disabled={removePhoto.isPending}>
              Delete
            </Button>
          </View>
        ))}
      </ScrollView>
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
  card: {
    gap: 8,
  },
  photo: {
    width: '100%',
    height: 220,
    borderRadius: 12,
  },
  muted: {
    opacity: 0.7,
  },
  errorText: {
    color: '#d32f2f',
  },
});
