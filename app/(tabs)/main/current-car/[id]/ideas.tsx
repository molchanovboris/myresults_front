import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function CurrentCarIdeasScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title">Ideas</ThemedText>
        <ThemedText style={styles.subtitle}>Upgrades, mods, and ideas for this car.</ThemedText>
        <Button mode="contained" onPress={() => {}}>
          Add
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
    gap: 16,
  },
  subtitle: {
    opacity: 0.7,
    textAlign: 'center',
  },
});
