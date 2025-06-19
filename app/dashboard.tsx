
//To add when wanted admins or even fosters to track pet activity logs.

//showing log trends by day or foster, like a summary dashboard.

//to add log-reminder banners or flag missing logs.


import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';


type Log = {
  id: string;
  petName: string;
  fosterName: string;
  date: string; 
  activity: string;
};

const sampleLogs: Log[] = [
  { id: '1', petName: 'Luna', fosterName: 'Alice', date: '2025-06-13', activity: 'Ate food, playful' },
  { id: '2', petName: 'Mochi', fosterName: 'Alice', date: '2025-06-13', activity: 'Did not eat, seems tired' },
  { id: '3', petName: 'Tofu', fosterName: 'Bob', date: '2025-06-12', activity: 'Walked and played' },
];

export default function DashboardScreen() {
  const [filter, setFilter] = useState<'pet' | 'foster' | 'date'>('pet');

  const groupLogs = () => {
    const grouped: Record<string, Log[]> = {};
    for (const log of sampleLogs) {
      const key = filter === 'pet' ? log.petName : filter === 'foster' ? log.fosterName : log.date;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(log);
    }
    return grouped;
  };

  const groupedLogs = groupLogs();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Dashboard</Text>
      <View style={styles.filterRow}>
        {['pet', 'foster', 'date'].map(type => (
          <TouchableOpacity key={type} onPress={() => setFilter(type as any)} style={[styles.button, filter === type && styles.activeButton]}>
            <Text style={styles.buttonText}>{type.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={Object.keys(groupedLogs)}
        keyExtractor={(key) => key}
        renderItem={({ item }) => (
          <View style={styles.groupBlock}>
            <Text style={styles.groupTitle}>{item}</Text>
            {groupedLogs[item].map(log => (
              <Text key={log.id} style={styles.logEntry}>• {log.date} - {log.petName} - {log.activity}</Text>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  filterRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  button: { padding: 8, backgroundColor: '#eee', borderRadius: 6 },
  activeButton: { backgroundColor: '#007bff' },
  buttonText: { color: '#000' },
  groupBlock: { marginBottom: 16 },
  groupTitle: { fontWeight: 'bold', fontSize: 18 },
  logEntry: { marginLeft: 10, marginTop: 4 },
});