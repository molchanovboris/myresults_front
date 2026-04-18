import { Redirect, Stack } from 'expo-router';

import { useAppStore } from '@/lib/stores/use-app-store';

export default function AuthLayout() {
  const token = useAppStore((state) => state.token);

  if (token) {
    return <Redirect href="/(tabs)/profile" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
