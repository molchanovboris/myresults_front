import { Platform } from 'react-native';

import { apiFetch } from '@/lib/api';
import type { PhotoListResponse, PhotoResponse } from '@/lib/types';

export type PhotoFile = {
  uri: string;
  name: string;
  mimeType: string;
};

export function fetchPhotos(carId: string) {
  return apiFetch<PhotoListResponse>(`/cars/${carId}/photos`);
}

export async function createPhoto(carId: string, file: PhotoFile, caption?: string) {
  const body = new FormData();
  if (caption) body.append('caption', caption);

  if (Platform.OS === 'web') {
    const response = await fetch(file.uri);
    const blob = await response.blob();
    const typed = blob.type.startsWith('image/')
      ? blob
      : new Blob([await blob.arrayBuffer()], { type: file.mimeType });
    body.append('photo', typed, file.name);
  } else {
    body.append('photo', {
      uri: file.uri,
      name: file.name,
      type: file.mimeType,
    } as unknown as Blob);
  }

  return apiFetch<PhotoResponse>(`/cars/${carId}/photos`, {
    method: 'POST',
    body,
  });
}

export function deletePhoto(carId: string, photoId: string) {
  return apiFetch<void>(`/cars/${carId}/photos/${photoId}`, { method: 'DELETE' });
}
