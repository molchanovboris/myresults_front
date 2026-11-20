import { useQuery } from '@tanstack/react-query';

import { fetchService, fetchServices } from '@/lib/services';
import { useAppStore } from '@/lib/stores/use-app-store';

export function useServices(carId: string | undefined) {
  const token = useAppStore((state) => state.token);

  return useQuery({
    queryKey: ['services', token, carId],
    queryFn: () => fetchServices(carId!),
    enabled: !!token && !!carId,
  });
}

export function useService(carId: string | undefined, serviceId: string | undefined) {
  const token = useAppStore((state) => state.token);

  return useQuery({
    queryKey: ['services', token, carId, serviceId],
    queryFn: () => fetchService(carId!, serviceId!),
    enabled: !!token && !!carId && !!serviceId,
  });
}
