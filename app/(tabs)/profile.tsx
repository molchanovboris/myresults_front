import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppStore } from '@/lib/stores/use-app-store';

export default function ProfileScreen() {
  const token = useAppStore((state) => state.token);
  const reset = useAppStore((state) => state.reset);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title">Profile</ThemedText>
        <ThemedText style={styles.subtitle}>You are authenticated.</ThemedText>
        <ThemedText style={styles.tokenText} numberOfLines={1}>
          Token: {token ?? 'none'}
        </ThemedText>
        <Button mode="outlined" onPress={reset}>
          Logout
        </Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 8,
  },
  subtitle: {
    opacity: 0.7,
  },
  tokenText: {
    opacity: 0.8,
  },
});
