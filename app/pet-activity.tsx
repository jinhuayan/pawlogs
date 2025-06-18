import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface LogEntry {
  id: string;
  date: string;
  category: string;
  notes: string;
}

const PetActivityOverview: React.FC = () => {
  const { name, emoji, petId } = useLocalSearchParams<{ name: string; emoji: string; petId: string }>();
  const router = useRouter();

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      date: '2025-06-17 08:00',
      category: 'Food',
      notes: 'Ate well.',
    },
    {
      id: '2',
      date: '2025-06-16 18:00',
      category: 'Medication',
      notes: 'Gave painkiller.',
    },
  ]);

  const renderLog = ({ item }: { item: LogEntry }) => (
    <View style={styles.logCard}>
      <Text style={styles.logDate}>{item.date}</Text>
      <Text style={styles.logCategory}>Category: {item.category}</Text>
      <Text style={styles.logNotes}>Notes: {item.notes}</Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push({ pathname: '/edit-log', params: { ...item, petId } })}
      >
        <Text style={styles.editButtonText}>✏️ Edit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{emoji} {name}'s Activity Logs</Text>
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={renderLog}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push({ pathname: '/add-log', params: { name, emoji, petId } })}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  logCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  logDate: { fontWeight: 'bold', marginBottom: 4 },
  logCategory: { marginBottom: 2 },
  logNotes: { marginBottom: 8 },
  editButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#7c5fc9',
    padding: 6,
    borderRadius: 6,
  },
  editButtonText: { color: '#fff', fontWeight: 'bold' },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#7c5fc9',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: { fontSize: 28, color: 'white' },
});

export default PetActivityOverview;
