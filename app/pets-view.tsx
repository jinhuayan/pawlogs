import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';

const userRole: 'foster' | 'admin' = 'foster';

type Pet = {
  id: string;
  name: string;
  age: number;
  location: string;
  emoji?: string;
  assigned?: boolean;
  status: 'Fostering' | 'Adopted' | 'Transferred';
};

const allPets: Pet[] = [
  { id: '1', name: 'Luna', age: 3, location: 'Toronto', emoji: '🐈', assigned: true, status: 'Fostering' },
  { id: '2', name: 'Mochi', age: 1, location: 'North York', emoji: '🐕', assigned: true, status: 'Adopted' },
  { id: '3', name: 'Tofu', age: 2, location: 'North York', emoji: '🐾', assigned: false, status: 'Transferred' },
  { id: '4', name: 'Biscuit', age: 4, location: 'Scarborough', emoji: '🐕', assigned: false, status: 'Fostering' },
];

const PetsScreen: React.FC = () => {
  const router = useRouter();

  const petsToShow = userRole === 'foster'
    ? allPets.filter(pet => pet.assigned)
    : allPets;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {userRole === 'foster' ? 'My Assigned Pets' : 'All Pets'}
      </Text>

      <FlatList
        data={petsToShow}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push(`/pet-calendar?petId=${item.id}&name=${item.name}&age=${item.age}&emoji=${item.emoji || '🐾'}`)
            }
          >
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{item.emoji || '🐾'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.petName}>{item.name} (Age {item.age})</Text>
              <Text style={styles.petLocation}>Location: {item.location}</Text>
              <Text style={styles.petStatus}>Status: {item.status}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdf6ff', padding: 16 },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#7c5fc9',
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e6d6fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: { fontWeight: 'bold', color: '#7c5fc9', fontSize: 20 },
  petName: { fontWeight: 'bold', fontSize: 18, marginBottom: 4, color: '#333' },
  petLocation: { fontSize: 16, color: '#555' },
  petStatus: { fontSize: 14, color: '#888', fontStyle: 'italic', marginTop: 4 },
});

export default PetsScreen;