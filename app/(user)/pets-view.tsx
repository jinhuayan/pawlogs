import React from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator } from 'react-native';
import PetsViewList from '@/components/PetsViewList';
import { useAuth } from '@/providers/AuthProvider';
import { usePetsList } from '@/api/pets';

const PetsScreen: React.FC = () => {
  const { data: petsQuery, isLoading, error } = usePetsList();
  const pets = petsQuery || [];
  const { isAdmin } = useAuth();

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Failed to fetch Pets</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {isAdmin === false ? 'My Assigned Pets' : 'All Pets'}
      </Text>
      {pets && pets.length > 0 && (<FlatList
        data={pets}
        keyExtractor={item => item.pet_id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <PetsViewList Pet={item} Mode={'user'} PressablePath={`/pet-calendar?petId=${item.pet_id}`} />
        )}
      />)}
      {pets && pets.length === 0 && (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>No pets found.</Text>
      )}
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