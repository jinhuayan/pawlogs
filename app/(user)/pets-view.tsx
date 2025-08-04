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
    ...Array.from(new Set(pets.map((pet: any) => (pet.species).toLowerCase()).filter(Boolean))),
  ], [pets]);
  console.log('Species Options:', speciesOptions);
  const statusOptions = useMemo(() => [
    ...Array.from(new Set(pets.map((pet: any) => (pet.status).toLowerCase()).filter(Boolean))),
  ], [pets]);
  console.log('Status Options:', statusOptions);

  const filters = [
    { label: 'Status', key: 'status', options: ['All', ...statusOptions] },
    { label: 'Species', key: 'species', options: ['All', ...speciesOptions] },
  ];
  console.log('Filters:', filters);
  // Filter state
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterValues, setFilterValues] = useState({
    status: 'All',
    species: 'All'
  });

  // Filter pets based on selected species and status
  const filteredPets = useMemo(() => {
    return pets.filter((pet: any) => {
      const speciesMatch = filterValues.species === 'All' || pet.species.toLowerCase() === filterValues.species;
      const statusMatch = filterValues.status === 'All' || pet.status.toLowerCase() === filterValues.status;
      return speciesMatch && statusMatch;
    });
  }, [pets, filterValues]);

  // Helper to show selected filters as chips
  const activeFilters = filters.map(f =>
    filterValues[f.key as keyof typeof filterValues] !== 'All' && {
      label: `${f.label}: ${filterValues[f.key as keyof typeof filterValues]}`,
      onClear: () => setFilterValues(prev => ({ ...prev, [f.key]: 'All' })),
    }
  ).filter(Boolean);

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Failed to fetch Pets</Text>;

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={styles.header}>My Pets</Text>

      {/* Filter Button */}
      <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
        <Ionicons name="filter" size={18} color="#fff" />
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>
      </View>
      {/* Selected Filters as Chips */}
            <View style={styles.chipContainer}>
              {activeFilters.length === 0 && (
                <Text style={styles.noFilterText}>No filters applied</Text>
              )}
              {activeFilters.map((filter: any) => (
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
              visible={filterModalVisible}
              transparent
              animationType="slide"
              onRequestClose={() => setFilterModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  {filters.map(f => (
                    <View key={f.key} style={{ marginBottom: 12 }}>
                      <Text style={styles.modalLabel}>{f.label}</Text>
                      {f.options.map(option => (
                        <TouchableOpacity
                          key={option}
                          style={[
                            styles.optionButton,
                            filterValues[f.key as keyof typeof filterValues] === option && styles.optionButtonActive,
                          ]}
                          onPress={() => setFilterValues(prev => ({ ...prev, [f.key]: option }))}
                        >
                          <Text
                            style={[
                              styles.optionText,
                              filterValues[f.key as keyof typeof filterValues] === option && styles.optionTextActive,
                            ]}
                          >
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => setFilterModalVisible(false)}
                  >
                    <Text style={styles.applyButtonText}>Apply</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setFilterModalVisible(false)}
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
  optionButton: {
    backgroundColor: '#f6f0fa',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#e6d6fa',
  },
  optionButtonActive: {
    backgroundColor: '#7c5fc9',
    borderColor: '#7c5fc9',
  },
  optionText: {
    color: '#7c5fc9',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionTextActive: {
    color: '#fff',
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