import React, { useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
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
    status: 'Active',
    role: 'All',
    approval: 'Approved',
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

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Failed to fetch Users</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Users</Text>
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
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  filterButton: {
    backgroundColor: '#e5d9fa',
    paddingHorizontal: 12,
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
    minWidth: 240,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#7c5fc9',
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: '#e5d9fa',
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    color: '#7c5fc9',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 16,
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
});

export default ManageUsers;