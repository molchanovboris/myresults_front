import { Stack, router } from 'expo-router';
import { Pressable } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function MainStackLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
          headerRight: () => (
            <Pressable onPress={() => router.push('/(tabs)/main/new-car')} style={{ marginRight: 8 }}>
              <IconSymbol size={22} name="plus" color={colors.text} />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="new-car"
        options={{
          title: 'New car',
        }}
      />
      <Stack.Screen
        name="current-car/[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
