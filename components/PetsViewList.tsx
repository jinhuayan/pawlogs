import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import {PetsViewListProps} from '@/types';
import {calculateAge} from '@/utils/calculateAge';

export default function PetsViewList({ Pet, Mode, PressablePath }: PetsViewListProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  router.push(PressablePath as any)
                }
              >
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{Pet.emoji || '🐾'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.petName}>{Pet.name} (Age {calculateAge(Pet.dob as any)})</Text>
                  <Text style={styles.petLocation}>Species: {Pet.species}</Text>
                  <Text style={styles.petStatus}>Status: {Pet.status}</Text>
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
  petName: { fontWeight: 'bold', fontSize: 18, marginBottom: 4, color: '#333' },
  petLocation: { fontSize: 16, color: '#555' },
  petStatus: { fontSize: 14, color: '#888', fontStyle: 'italic', marginTop: 4 },
});