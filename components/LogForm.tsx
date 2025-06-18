import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

interface LogFormProps {
  mode: 'add' | 'edit';
  petInfo: { petId: string; name: string; age: string; emoji: string };
  logId?: string;
}

const categories = ['Food', 'Water', 'Litter', 'Medication', 'Play', 'Other'];

const LogForm: React.FC<LogFormProps> = ({ mode, petInfo, logId }) => {
  const [category, setCategory] = useState(categories[0]);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = () => {
    alert(`${mode === 'add' ? 'Added' : 'Updated'} log for ${petInfo.name}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>
        {petInfo.emoji} {mode === 'add' ? 'Add New Log' : 'Edit Log'}
      </Text>

      <Text style={styles.label}>Category:</Text>
      <View style={styles.inputBox}>
        <Picker selectedValue={category} onValueChange={setCategory}>
          {categories.map(cat => <Picker.Item key={cat} label={cat} value={cat} />)}
        </Picker>
      </View>

      <Text style={styles.label}>Notes:</Text>
      <TextInput
        style={[styles.inputBox, { height: 100 }]}
        multiline
        value={notes}
        onChangeText={setNotes}
        placeholder="Enter notes"
      />

      <Text style={styles.label}>Date & Time:</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.inputBox}
      >
        <Text>{date.toLocaleString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(_, selectedDate) => {
            if (selectedDate) {
              setDate(selectedDate);
              setShowDatePicker(false);
            }
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {mode === 'add' ? '➕ Add Log' : '✏️ Update Log'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '500', marginTop: 12 },
  inputBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#faf9fa',
    marginBottom: 8,
  },
  button: {
    marginTop: 32,
    backgroundColor: '#7c5fc9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default LogForm;
