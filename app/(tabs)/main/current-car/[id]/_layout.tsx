import { HeaderBackButton } from '@react-navigation/elements';
import { useTheme } from '@react-navigation/native';
import { Stack, router, useLocalSearchParams } from 'expo-router';

import { useCar } from '@/lib/hooks/use-car';

export default function CurrentCarLayout() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data } = useCar(id);
  const car = data?.car;
  const carTitle = car ? `${car.make} ${car.model}` : 'Car';

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
      <Stack.Screen name="service" options={{ title: 'Service' }} />
      <Stack.Screen name="add-service" options={{ title: 'Новая запись' }} />
      <Stack.Screen name="service-record/[serviceId]" options={{ title: 'Запись сервиса' }} />
      <Stack.Screen name="ideas" options={{ title: 'Ideas' }} />
    </Stack>
  );
}
