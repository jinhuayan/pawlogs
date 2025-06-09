import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export const meta = {
  title: 'Edit Pet Activity',
};

const fosterName = 'Jane D.';
const petName = 'Luna';
const petAge = 3;
const petEmoji = '🐈';

const activityCategories = ['Food', 'Water', 'Litter', 'Medication', 'Play', 'Other'];

const PetActivityForm: React.FC = () => {
  const [date, setDate] = useState(new Date(2025, 4, 29, 9, 0));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState(activityCategories[0]);
  const [notes, setNotes] = useState('Gave 1/4 cup dry food');

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      if (event.type === 'set' && selectedDate) {
        setDate(selectedDate);
      }
      setShowDatePicker(false);
    } else {
      if (selectedDate) setDate(selectedDate);
    }
  };

  const handleSubmit = () => {
    // Submit logic here
    alert('Activity logged!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.petHeader}>
        <View style={styles.petAvatar}>
          <Text style={{ fontSize: 64 }}>{petEmoji}</Text>
        </View>
        <Text style={styles.petName}>{`${petEmoji} ${petName} (Age ${petAge})`}</Text>
        <Text style={styles.fosterText}>👤 Foster : <Text style={{ fontWeight: 'bold' }}>{fosterName}</Text></Text>
      </View>

      <Text style={styles.label}>📅 Log Time:</Text>
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: 16 }}>
          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {date.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Activity Category:</Text>
      <View style={styles.inputBox}>
        <Picker
          selectedValue={category}
          onValueChange={setCategory}
          style={{ width: '100%' }}
        >
          {activityCategories.map(cat => (
            <Picker.Item label={cat} value={cat} key={cat} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Additional Notes:</Text>
      <TextInput
        style={[styles.inputBox, styles.notesInput]}
        multiline
        value={notes}
        onChangeText={setNotes}
        placeholder="Enter notes"
      />

      <TouchableOpacity style={styles.logButton} onPress={handleSubmit}>
        <Text style={styles.logButtonText}>📝 Log</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 32,
  },
  petHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  petAvatar: {
    backgroundColor: '#e6d6fa',
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  fosterText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
    fontWeight: '500',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#faf9fa',
    marginBottom: 8,
  },
  notesInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  logButton: {
    marginTop: 32,
    alignSelf: 'center',
    backgroundColor: '#7c5fc9',
    borderRadius: 40,
    paddingVertical: 18,
    paddingHorizontal: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PetActivityForm;