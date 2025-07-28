import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';

const activityCategories = ['Food', 'Water', 'Litter', 'Medication', 'Play', 'Other'];

const EditLogScreen: React.FC = () => {
  const router = useRouter();
  const { id, category, notes, timestamp } = useLocalSearchParams<{
    id: string;
    category: string;
    notes: string;
    timestamp: string;
  }>();

  const [logDate, setLogDate] = useState(new Date(timestamp || Date.now()));
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [logCategory, setLogCategory] = useState(category || activityCategories[0]);
  const [logNotes, setLogNotes] = useState(notes || '');

  const handleTimeChange = (_event: any, selectedTime?: Date) => {
    if (selectedTime) {
      const updated = new Date(logDate);
      updated.setHours(selectedTime.getHours());
      updated.setMinutes(selectedTime.getMinutes());
      setLogDate(updated);
    }
    setShowTimePicker(false);
  };

  const handleSave = () => {
    alert(`Updated Log: ${logCategory} at ${logDate.toLocaleString()}`);
    // TODO: Send updated log to backend
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Edit Activity Log</Text>

          <Text style={styles.label}>📅 Log Date & Time</Text>
          <View style={styles.inputBox}>
            <Text>{logDate.toLocaleString()}</Text>
          </View>
          <TouchableOpacity style={styles.changeTimeButton} onPress={() => setShowTimePicker(true)}>
            <Text style={styles.changeTimeText}>⏱ Change Time</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={logDate}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}

          <Text style={styles.label}>📌 Activity Category</Text>
          <View style={styles.inputBox}>
            <Picker selectedValue={logCategory} onValueChange={setLogCategory}>
              {activityCategories.map(cat => (
                <Picker.Item label={cat} value={cat} key={cat} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>🗒 Notes</Text>
          <TextInput
            style={[styles.inputBox, styles.notesInput]}
            value={logNotes}
            onChangeText={setLogNotes}
            multiline
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>💾 Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    paddingBottom: 140,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 6,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#faf9fa',
    marginBottom: 8,
  },
  notesInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  changeTimeButton: {
    backgroundColor: '#e0d4fa',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  changeTimeText: {
    color: '#5a3db4',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#7c5fc9',
    paddingVertical: 18,
    borderRadius: 40,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditLogScreen;
