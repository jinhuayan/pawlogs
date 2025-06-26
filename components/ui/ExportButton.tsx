import React from 'react';
import { Button, View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useExport } from '../../hooks/useExport';

export function ExportButton({ logs }: { logs: any[] }) {
  const { exporting, error, exportLogs } = useExport();

  return (
    <View style={styles.container}>
      {exporting ? (
        <ActivityIndicator />
      ) : (
        <Button title="Export to Google Sheets" onPress={() => exportLogs(logs)} />
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { margin: 16 },
  error: { color: 'red', marginTop: 8 },
});