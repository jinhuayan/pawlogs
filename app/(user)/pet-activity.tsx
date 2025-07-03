import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Modal, TextInput
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface LogEntry {
  id: string;
  date: string;
  category: string;
  notes: string;
}

const categories = ['All', 'Food', 'Medication', 'Litter'];

const PetActivityOverview: React.FC = () => {
  const { name, emoji, petId, date } = useLocalSearchParams<{ name: string; emoji: string; petId: string; date: string }>();
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

  const [filteredLogs, setFilteredLogs] = useState(logs);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');

  const applyFilter = () => {
    let filtered = logs;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(log => log.category === selectedCategory);
    }

    if (selectedDate) {
      filtered = filtered.filter(log => log.date.startsWith(selectedDate));
    }

    setFilteredLogs(filtered);
    setFilterModalVisible(false);
  };

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

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setFilterModalVisible(true)}
      >
        <Text style={styles.filterButtonText}>Filter Logs</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredLogs}
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

      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Logs</Text>

            <Text style={styles.label}>Category:</Text>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              style={styles.picker}
            >
              {categories.map((cat) => (
                <Picker.Item label={cat} value={cat} key={cat} />
              ))}
            </Picker>

            <Text style={styles.label}>Date:</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={selectedDate}
              onChangeText={setSelectedDate}
            />

            <TouchableOpacity style={styles.applyButton} onPress={applyFilter}>
              <Text style={styles.applyButtonText}>Apply Filter</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setFilterModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  filterButton: {
    backgroundColor: '#7c5fc9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  filterButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  logCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  logDate: { fontWeight: 'bold', marginBottom: 4, color: '#555' },
  logCategory: { marginBottom: 2, color: '#777' },
  logNotes: { marginBottom: 8, color: '#333' },
  editButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#7c5fc9',
    padding: 8,
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
    elevation: 4,
  },
  fabText: { fontSize: 28, color: 'white' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  label: { fontSize: 16, marginBottom: 8, color: '#555' },
  picker: { width: '100%', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  applyButton: {
    backgroundColor: '#7c5fc9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  applyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelButton: {
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: { color: '#333', fontWeight: 'bold', fontSize: 16 },
});

export default PetActivityOverview;