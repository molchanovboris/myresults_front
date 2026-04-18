import { Link, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function CurrentCarHubScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="subtitle" style={styles.heading}>
          Sections
        </ThemedText>
        <Link href={`/(tabs)/main/current-car/${id}/info`} asChild>
          <Button mode="contained-tonal" style={styles.link}>
            Info
          </Button>
        </Link>
        <Link href={`/(tabs)/main/current-car/${id}/service`} asChild>
          <Button mode="contained-tonal" style={styles.link}>
            Service
          </Button>
        </Link>
        <Link href={`/(tabs)/main/current-car/${id}/ideas`} asChild>
          <Button mode="contained-tonal" style={styles.link}>
            Ideas
          </Button>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 12,
  },
  heading: {
    marginBottom: 4,
  },
  link: {
    width: '100%',
  },
});
