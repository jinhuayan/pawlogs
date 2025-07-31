import React, { useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUsersList } from '@/api/users';
import UsersViewList from '@/components/UsersViewList';

const FILTERS = [
  { label: 'Status', key: 'status', options: ['All', 'Active', 'Inactive'] },
  { label: 'Role', key: 'role', options: ['All', 'Admin', 'Foster'] },
  { label: 'Approval', key: 'approval', options: ['All', 'Approved', 'Declined', 'Pending'] },
];

const ManageUsers: React.FC = () => {
  const { data: usersQuery, isLoading, error } = useUsersList();
  const users = usersQuery || [];

  // Filter state
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState({
    status: 'All',
    role: 'All',
    approval: 'All',
  });

  // Filtering logic
  const filteredUsers = users.filter(user => {
    // Status filter
    if (
      filterValues.status === 'Active' && !user.active ||
      filterValues.status === 'Inactive' && user.active
    ) return false;

    // Role filter
    if (
      filterValues.role === 'Admin' && user.role !== 'admin' ||
      filterValues.role === 'Foster' && user.role !== 'foster'
    ) return false;

    // Approval filter
    if (
      filterValues.approval === 'Approved' && user.approved !== true ||
      filterValues.approval === 'Declined' && user.approved !== false ||
      filterValues.approval === 'Pending' && user.approved !== null
    ) return false;

    return true;
  });

  // Helper to show selected filters as chips
  const activeFilters = FILTERS.map(f =>
    filterValues[f.key] !== 'All' && {
      label: `${f.label}: ${filterValues[f.key]}`,
      onClear: () => setFilterValues(prev => ({ ...prev, [f.key]: 'All' })),
    }
  ).filter(Boolean);

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Failed to fetch Users</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Users</Text>

      {/* Filter Button */}
      <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
        <Ionicons name="filter" size={18} color="#fff" />
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>

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
            <Text style={styles.modalTitle}>Filter Users</Text>
            {FILTERS.map(f => (
              <View key={f.key} style={{ marginBottom: 12 }}>
                <Text style={styles.modalLabel}>{f.label}</Text>
                {f.options.map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      filterValues[f.key] === option && styles.optionButtonActive,
                    ]}
                    onPress={() => setFilterValues(prev => ({ ...prev, [f.key]: option }))}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        filterValues[f.key] === option && styles.optionTextActive,
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

      {filteredUsers.length > 0 ? (
        <FlatList
          data={filteredUsers}
          keyExtractor={item => item.user_id}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <UsersViewList User={item} PressablePath={`/edit-user?userId=${item.user_id}`} />
          )}
        />
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>No User found.</Text>
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
    marginBottom: 4,
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

export default ManageUsers;