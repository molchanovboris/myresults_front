import { useMutation } from '@tanstack/react-query';

import { createCar } from '@/lib/cars';
import { queryClient } from '@/lib/query-client';

export function useCreateCar() {
  return useMutation({
    mutationFn: createCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
  });
}
