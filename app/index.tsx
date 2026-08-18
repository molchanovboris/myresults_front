import { Redirect } from 'expo-router';

import { useAppStore } from '@/lib/stores/use-app-store';

export default function RootIndex() {
  const token = useAppStore((state) => state.token);

  if (token) {
    return <Redirect href="/(tabs)/main" />;
  }

  return <Redirect href="/(auth)/login" />;
}
