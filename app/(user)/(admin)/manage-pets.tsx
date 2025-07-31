import React, { useState } from 'react';
import { StyleSheet, Text, ActivityIndicator, View, FlatList, TouchableOpacity, Modal } from 'react-native';
import { usePetsList } from '@/api/pets';
import PetsViewList from '@/components/PetsViewList';
import { router } from 'expo-router';

const statusOptions = ['available', 'adopted', 'fostering'];

const ManagePets: React.FC = () => {
  const { data: petsQuery, isLoading, error } = usePetsList();
  const pets = petsQuery || [];

  // Get unique species from pets data
  const speciesSet = new Set<string>();
  pets.forEach(pet => {
    if (pet.species) speciesSet.add(pet.species);
  });
  const speciesOptions = ['All', ...Array.from(speciesSet)];

  // Filter state
  const FILTERS = [
    { key: 'species', label: 'Species', options: speciesOptions },
    { key: 'status', label: 'Status', options: statusOptions },
  ];
  const [filterValues, setFilterValues] = useState({
    species: 'All',
    status: 'available',
  });
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Filtering logic
  const filteredPets = pets.filter(pet => {
    const speciesMatch = filterValues.species === 'All' || pet.species === filterValues.species;
    const statusMatch = pet.status === filterValues.status;
    return speciesMatch && statusMatch;
  });

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Failed to fetch Pets</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Pets</Text>
      {/* Filters */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={styles.filterButton}
            onPress={() => {
              setSelectedFilter(f.key);
              setFilterModalVisible(true);
            }}
          >
            <Text style={styles.filterText}>
              {f.label}: {filterValues[f.key as keyof typeof filterValues]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>
              Select {FILTERS.find(f => f.key === selectedFilter)?.label}
            </Text>
            {selectedFilter &&
              FILTERS.find(f => f.key === selectedFilter)?.options.map(option => (
                <TouchableOpacity
                  key={option}
                  style={styles.optionButton}
                  onPress={() => {
                    setFilterValues(prev => ({
                      ...prev,
                      [selectedFilter]: option,
                    }));
                    setFilterModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/edit-pet')}
        >
          <Text style={styles.createButtonText}>Create Pet</Text>
        </TouchableOpacity>
      </View>
      {filteredPets && filteredPets.length > 0 && (
        <FlatList
          data={filteredPets}
          keyExtractor={item => item.pet_id}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <PetsViewList Pet={item} Mode={'admin'} PressablePath={`/edit-pet?petId=${item.pet_id}`} />
          )}
        />
      )}
      {filteredPets && filteredPets.length === 0 && (
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
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  filterButton: {
    backgroundColor: '#e5d9fa',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  filterText: {
    color: '#7c5fc9',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: 280,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7c5fc9',
    marginBottom: 16,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#e6ddfa',
    marginBottom: 8,
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    color: '#7c5fc9',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#7c5fc9',
    width: '100%',
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#7c5fc9',
    paddingVertical: 10,
    paddingHorizontal: 100,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ManagePets;