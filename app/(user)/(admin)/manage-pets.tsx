import React from 'react';
import {  StyleSheet, Text, ActivityIndicator, View, FlatList, Pressable } from 'react-native';
import { usePetsList } from '@/api/pets';
import PetsViewList from '@/components/PetsViewList';
import { router } from 'expo-router';

const ManagePets: React.FC = () => {
  const { data: petsQuery, isLoading, error } = usePetsList();
  const pets = petsQuery || [];
  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Failed to fetch Pets</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Pets</Text>
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
      <Pressable
        style={{
        backgroundColor: '#7c5fc9',
        paddingVertical: 10,
        paddingHorizontal: 100,
        borderRadius: 8,
        alignItems: 'center',
        }}
        onPress={() => {router.push('/edit-pet')
        }}
      >
        <Text
        style={{
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 16,
        }}
        >
        Create Pet
        </Text>
      </Pressable>
      </View>
      {pets && pets.length > 0 && (
      <FlatList
        data={pets}
        keyExtractor={item => item.pet_id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
        <PetsViewList Pet={item} Mode={'user'} PressablePath={`/edit-pet?petId=${item.pet_id}`} />
        )}
      />
      )}
      {pets && pets.length === 0 && (
      <Text style={{ textAlign: 'center', marginTop: 20 }}>No pets found.</Text>
      )}
    </View>
  )
}

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

export default ManagePets; 