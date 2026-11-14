import { useQuery } from '@tanstack/react-query';

import { fetchCars } from '@/lib/cars';
import { useAppStore } from '@/lib/stores/use-app-store';

export function useCars() {
  const token = useAppStore((state) => state.token);

  return useQuery({
    queryKey: ['cars', token],
    queryFn: fetchCars,
    enabled: !!token,
  });
}
