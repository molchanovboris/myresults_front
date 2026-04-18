import { HeaderBackButton } from '@react-navigation/elements';
import { useTheme } from '@react-navigation/native';
import { Stack, router, useLocalSearchParams } from 'expo-router';

import { useAppStore } from '@/lib/stores/use-app-store';

export default function CurrentCarLayout() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const car = useAppStore((state) => state.cars.find((item) => item.id === id));
  const carTitle = car ? `${car.manufacturer} ${car.model}` : 'Car';

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: carTitle,
          // Nested stack root: no parent header (main hides it for this segment),
          // so we must pop the main stack explicitly to return to the car list.
          headerLeft: (props) => (
            <HeaderBackButton
              {...props}
              onPress={() => router.back()}
              tintColor={theme.colors.text}
            />
          ),
        }}
      />
      <Stack.Screen name="info" options={{ title: 'Info' }} />
      <Stack.Screen name="service" options={{ title: 'Service' }} />
      <Stack.Screen name="ideas" options={{ title: 'Ideas' }} />
    </Stack>
  );
}
