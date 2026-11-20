import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/app-button';
import { ScreenTitle } from '@/components/ui/screen-title';

export default function CurrentCarIdeasScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ScreenTitle>Ideas</ScreenTitle>
        <ThemedText style={styles.subtitle}>Upgrades, mods, and ideas for this car.</ThemedText>
        <AppButton onPress={() => {}}>Add</AppButton>
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
