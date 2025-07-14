import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { UsersViewListProps } from '@/types';

export default function UsersViewList({ User, PressablePath }: UsersViewListProps) {
  const router = useRouter();

  const hasName = User.fname && User.lname;
  const displayName = hasName ? `${User.fname} ${User.lname}` : 'n/a';

  let approvalText = null;
  if (User.approved === null) {
    approvalText = (
      <Text style={styles.approvalPending}>Pending</Text>
    );
  } else if (User.approved === false) {
    approvalText = (
      <Text style={styles.approvalDeclined}>Declined</Text>
    );
  } else if (User.approved === true) {
    approvalText = (
      <Text style={styles.approvalApproved}>Approved</Text>
    );
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(PressablePath as any)}
    >
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{'👤'}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.userName, !hasName && styles.naText]}>
          {displayName}
        </Text>
        <Text style={styles.userEmail}>Email: {User.email}</Text>
        <Text style={styles.userRole}>
          Role: {User.role} | Status: {User.active === true ? 'Active' : 'Inactive'}
        </Text>
        {approvalText}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdf6ff', padding: 16 },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#7c5fc9',
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e6d6fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: { fontWeight: 'bold', color: '#7c5fc9', fontSize: 20 },
  userName: { fontWeight: 'bold', fontSize: 18, marginBottom: 4, color: '#333' },
  userEmail: { fontSize: 16, color: '#555' },
  userRole: { fontSize: 14, color: '#888', fontStyle: 'italic', marginTop: 4 },
  naText: { color: 'red' },
  approvalPending: { color: '#e6b800', fontSize: 14, marginTop: 2 }, // yellow
  approvalDeclined: { color: '#d32f2f', fontSize: 14, marginTop: 2 }, // red
  approvalApproved: { color: '#388e3c', fontSize: 14, marginTop: 2 }, // green
});