import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import PetsViewList from '@/components/PetsViewList';
import { Pet } from '@/types';
import { useAuth } from '@/providers/AuthProvider';

const allPets: Pet[] = [
  { id: '1', name: 'Luna', age: 3, location: 'Toronto', emoji: '🐈', assigned: true, status: 'Fostering' },
  { id: '2', name: 'Mochi', age: 1, location: 'North York', emoji: '🐕', assigned: true, status: 'Adopted' },
  { id: '3', name: 'Tofu', age: 2, location: 'North York', emoji: '🐾', assigned: false, status: 'Transferred' },
  { id: '4', name: 'Biscuit', age: 4, location: 'Scarborough', emoji: '🐕', assigned: false, status: 'Fostering' },
];

const PetsScreen: React.FC = () => {
  var userRole = 'foster'; // Default role for users
  const router = useRouter();
  const { isAdmin } = useAuth();
  if (isAdmin) {
    userRole = 'admin';
  }

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
          <PetsViewList Pet={item} Mode={'user'} PressablePath={`/pet-calendar?petId=${item.id}&name=${item.name}&age=${item.age}&emoji=${item.emoji || '🐾'}`} />
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
  }
});

export default PetsScreen;