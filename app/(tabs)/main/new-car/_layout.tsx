import { HeaderBackButton } from '@react-navigation/elements';
import { useTheme } from '@react-navigation/native';
import { Stack, router } from 'expo-router';

export default function NewCarLayout() {
  const theme = useTheme();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'New car',
          headerLeft: (props) => (
            <HeaderBackButton
              {...props}
              onPress={() => router.back()}
              tintColor={theme.colors.text}
            />
          ),
        }}
      />
      <Stack.Screen name="details" options={{ title: 'Car details' }} />
    </Stack>
  );
}
