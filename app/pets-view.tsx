import React from 'react';
import { View, StyleSheet, FlatList, Button } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';  // import router

export const meta = {
  title: 'Pets View',
};

const userRole: 'foster' | 'admin' = 'foster';

type Pet = {
  id: string;
  name: string;
  age: number;
  location: string;
  assigned?: boolean;
};

const allPets: Pet[] = [
  { id: '1', name: 'Luna', age: 3, location: 'Toronto', assigned: true },
  { id: '2', name: 'Mochi', age: 1, location: 'North York', assigned: true },
  { id: '3', name: 'Tofu', age: 2, location: 'North York', assigned: false },
  { id: '4', name: 'Biscuit', age: 4, location: 'Scarborough', assigned: false },
];

const PetsScreen: React.FC = () => {
  const router = useRouter(); // get router

  const petsToShow = userRole === 'foster'
    ? allPets.filter(pet => pet.assigned)
    : allPets;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        {userRole === 'foster' ? ' 🐾  My Assigned Pets' : ' 🐾  All Pets'}
      </ThemedText>

      {/* Add Pet button */}
      <Button title="Add Pet" onPress={() => router.push('/create-pet')} />

      <FlatList
        data={petsToShow}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.avatarCircle}>
              <ThemedText style={styles.avatarText}>A</ThemedText>
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.petName}>
                {item.name} (Age {item.age})
              </ThemedText>
              <ThemedText style={styles.petLocation}>
                Location: {item.location}
              </ThemedText>
            </View>
            <View style={styles.iconGroup}>
              <View style={styles.iconPlaceholder} />
              <View style={styles.iconPlaceholder} />
              <View style={styles.iconPlaceholder} />
            </View>
          </View>
        )}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf9fa',
    padding: 16,
    paddingTop: 32,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 4,
  },
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
  iconGroup: {
    flexDirection: 'row',
    marginLeft: 12,
    gap: 8,
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#e6d6fa',
    marginLeft: 8,
    opacity: 0.4,
  },
});

export default PetsScreen;
