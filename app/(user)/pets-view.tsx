import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import PetsViewList from '@/components/PetsViewList';
import { useAuth } from '@/providers/AuthProvider';
import { usePetsList } from '@/api/pets';
import { Ionicons } from '@expo/vector-icons';

const PetsScreen: React.FC = () => {
  const { data: petsQuery, isLoading, error } = usePetsList();
  const pets = petsQuery || [];
  const { isAdmin } = useAuth();

  // Dynamically get unique species and status options from pets data
  const speciesOptions = useMemo(() => [
    'All',
    ...Array.from(new Set(pets.map((pet: any) => pet.species).filter(Boolean))),
  ], [pets]);
  const statusOptions = useMemo(() => [
    'All',
    ...Array.from(new Set(pets.map((pet: any) => pet.status).filter(Boolean))),
  ], [pets]);

  const [selectedSpecies, setSelectedSpecies] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [filterVisible, setFilterVisible] = useState(false);

  // Filter pets based on selected species and status
  const filteredPets = useMemo(() => {
    return pets.filter((pet: any) => {
      const speciesMatch = selectedSpecies === 'All' || pet.species === selectedSpecies;
      const statusMatch = selectedStatus === 'All' || pet.status === selectedStatus;
      return speciesMatch && statusMatch;
    });
  }, [pets, selectedSpecies, selectedStatus]);

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Failed to fetch Pets</Text>;
  }

  // Helper to show selected filters as chips
  const activeFilters = [
    selectedSpecies !== 'All' && { label: selectedSpecies, onClear: () => setSelectedSpecies('All') },
    selectedStatus !== 'All' && { label: selectedStatus, onClear: () => setSelectedStatus('All') },
  ].filter(Boolean);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {isAdmin === false ? 'My Assigned Pets' : 'All Pets'}
      </Text>

      {/* Filter Button */}
      <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
        <Ionicons name="filter" size={18} color="#fff" />
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>

      {/* Selected Filters as Chips */}
      <View style={styles.chipContainer}>
        {activeFilters.length === 0 && (
          <Text style={styles.noFilterText}>No filters applied</Text>
        )}
        {activeFilters.map((filter: any, idx) => (
          <View key={filter.label} style={styles.chip}>
            <Text style={styles.chipText}>{filter.label}</Text>
            <TouchableOpacity onPress={filter.onClear}>
              <Ionicons name="close-circle" size={16} color="#7c5fc9" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Pets</Text>
            <Text style={styles.modalLabel}>Species</Text>
            <View style={styles.modalPicker}>
              <Picker
                selectedValue={selectedSpecies}
                onValueChange={setSelectedSpecies}
                dropdownIconColor="#7c5fc9"
              >
                {speciesOptions.map(opt => (
                  <Picker.Item label={opt} value={opt} key={opt} />
                ))}
              </Picker>
            </View>
            <Text style={styles.modalLabel}>Status</Text>
            <View style={styles.modalPicker}>
              <Picker
                selectedValue={selectedStatus}
                onValueChange={setSelectedStatus}
                dropdownIconColor="#7c5fc9"
              >
                {statusOptions.map(opt => (
                  <Picker.Item label={opt} value={opt} key={opt} />
                ))}
              </Picker>
            </View>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setFilterVisible(false)}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setFilterVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {filteredPets && filteredPets.length > 0 && (
        <FlatList
          data={filteredPets}
          keyExtractor={item => item.pet_id}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <PetsViewList Pet={item} Mode={'user'} PressablePath={`/pet-calendar?petId=${item.pet_id}`} />
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
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#7c5fc9',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginBottom: 8,
    shadowColor: '#7c5fc9',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    minHeight: 24,
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6d6fa',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  chipText: {
    color: '#7c5fc9',
    fontWeight: 'bold',
    fontSize: 14,
  },
  noFilterText: {
    color: '#aaa',
    fontSize: 14,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7c5fc9',
    marginBottom: 18,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 15,
    color: '#7c5fc9',
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 2,
  },
  modalPicker: {
    backgroundColor: '#f6f0fa',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e6d6fa',
    overflow: 'hidden',
  },
  applyButton: {
    backgroundColor: '#7c5fc9',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#7c5fc9',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default PetsScreen;