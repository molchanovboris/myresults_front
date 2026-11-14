import { useQuery } from '@tanstack/react-query';

import { fetchMe } from '@/lib/auth';
import { useAppStore } from '@/lib/stores/use-app-store';

export function useMe() {
  const token = useAppStore((state) => state.token);

  return useQuery({
    queryKey: ['auth', 'me', token],
    queryFn: fetchMe,
    enabled: !!token,
  });
}
