import { useQuery } from '@tanstack/react-query';

import { fetchPhotos } from '@/features/photos';
import { useAppStore } from '@/lib/stores/use-app-store';

export function usePhotos(carId: string | undefined) {
  const token = useAppStore((state) => state.token);

  return useQuery({
    queryKey: ['photos', token, carId],
    queryFn: () => fetchPhotos(carId!),
    enabled: !!token && !!carId,
  });
}
