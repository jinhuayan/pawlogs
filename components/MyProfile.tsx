import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';
import * as Notifications from 'expo-notifications';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const MyProfileModal: React.FC<Props> = ({ visible, onClose }) => {
  const { user } = useAuth();

  const fullName = (user?.fname || '') + (user?.lname ? ' ' + user.lname : '');
  const displayName = fullName.trim() || 'n/a';

  const handleLogout = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('Logout Error: ' + error.message);
    } else {
      
      onClose(); // Optional: close modal after logout
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.modalView}>
          <Text style={styles.header}>My Profile</Text>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{displayName}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user?.email || 'n/a'}</Text>
          <Text style={styles.label}>Role:</Text>
          <Text style={styles.value}>{user?.role || 'n/a'}</Text>

          <View style={styles.buttonContainer}>
            <Button title="Sign Out" onPress={handleLogout} color="#7c5fc9" />
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Close" onPress={onClose} color="#aaa" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    backgroundColor: '#fdf6ff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'stretch',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7c5fc9',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: '#7c5fc9',
  },
  value: {
    fontSize: 18,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default MyProfileModal;
