import { useQuery } from '@tanstack/react-query';

import { fetchCar } from '@/lib/cars';
import { useAppStore } from '@/lib/stores/use-app-store';

export function useCar(id: string | undefined) {
  const token = useAppStore((state) => state.token);

  return useQuery({
    queryKey: ['cars', token, id],
    queryFn: () => fetchCar(id!),
    enabled: !!token && !!id,
  });
}
