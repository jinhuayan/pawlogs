import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter, useLocalSearchParams } from 'expo-router';

const AddLogScreen = () => {
  const router = useRouter();
  const { petId } = useLocalSearchParams<{ petId: string }>();

  const [date, setDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [category, setCategory] = useState('Food');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    // Send data to backend
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Log</Text>

      <Text style={styles.label}>Date & Time:</Text>
      <TouchableOpacity style={styles.inputBox} onPress={() => setShowTimePicker(true)}>
        <Text>{date.toLocaleString()}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(e, d) => {
            if (d) setDate(d);
            setShowTimePicker(false);
          }}
        />
      )}

      <Text style={styles.label}>Category:</Text>
      <View style={styles.inputBox}>
        <Picker selectedValue={category} onValueChange={setCategory}>
          {['Food', 'Water', 'Litter', 'Medication', 'Play', 'Other'].map(c => (
            <Picker.Item label={c} value={c} key={c} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Notes:</Text>
      <TextInput
        style={[styles.inputBox, { minHeight: 80 }]}
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Log</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  label: { fontWeight: '500', marginTop: 12 },
  inputBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#7c5fc9',
    marginTop: 24,
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});

export default AddLogScreen;
