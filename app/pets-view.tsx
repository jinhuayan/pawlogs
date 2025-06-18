import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';

export const meta = {
  title: 'Pets View',
};

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
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        {userRole === 'foster' ? ' 🐾  My Assigned Pets' : ' 🐾  All Pets'}
      </ThemedText>

      <Button
        title="Create New Pet"
        onPress={() => router.push('/create-pet')}
        color="#7c5fc9"
      />

      <FlatList
        data={petsToShow}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 24, marginTop: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push(
                `/pet-activity?petId=${item.id}&name=${item.name}&age=${item.age}&emoji=${item.emoji || '🐾'}`
              )
            }
          >
            <View style={styles.avatarCircle}>
              <ThemedText style={styles.avatarText}>{item.emoji || '🐾'}</ThemedText>
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.petName}>
                {item.name} (Age {item.age})
              </ThemedText>
              <ThemedText style={styles.petLocation}>
                Location: {item.location}
              </ThemedText>
              <ThemedText style={styles.petStatus}>
                Status: {item.status}
              </ThemedText>
            </View>
          </TouchableOpacity>
        )}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf9fa', padding: 16, paddingTop: 32 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, marginLeft: 4 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f2fa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6d6fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontWeight: 'bold',
    color: '#7c5fc9',
    fontSize: 18,
  },
  petName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  petLocation: {
    fontSize: 14,
    color: '#555',
  },
  petStatus: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 2,
  },
});

export default PetsScreen;
