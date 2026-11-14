import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useMe } from '@/lib/hooks/use-me';
import { queryClient } from '@/lib/query-client';
import { useAppStore } from '@/lib/stores/use-app-store';

export default function ProfileScreen() {
  const reset = useAppStore((state) => state.reset);
  const { data, isPending, isError, error } = useMe();

  const onLogout = () => {
    queryClient.removeQueries({ queryKey: ['auth', 'me'] });
    reset();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title">Profile</ThemedText>
        {isPending ? <ThemedText style={styles.subtitle}>Loading profile…</ThemedText> : null}
        {data?.user ? (
          <>
            <ThemedText style={styles.subtitle}>{data.user.email}</ThemedText>
            {data.user.name ? <ThemedText style={styles.subtitle}>{data.user.name}</ThemedText> : null}
          </>
        ) : null}
        {isError ? <ThemedText style={styles.errorText}>{error?.message ?? 'Could not load profile'}</ThemedText> : null}
        <Button mode="outlined" onPress={onLogout}>
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
  errorText: {
    color: '#d32f2f',
  },
});
