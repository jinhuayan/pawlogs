

import 'react-native-url-polyfill/auto';
import React, { useState } from 'react';
import { View, Button, Alert, StyleSheet, Text } from 'react-native';

// import { createClient } from '@supabase/supabase-js';
// import { supabase } from '@/lib/supabase';
// import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY } from '@env';
// import Constants from 'expo-constants';


// const { supabaseUrl, supabaseAnonKey } = Constants.extra as {
//   supabaseUrl: string;
//   supabaseAnonKey: string;
// }

import { supabase } from '@/lib/supabase';
// const supabase = createClient(EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY);

// const supabase = createClient(supabaseUrl, supabaseAnonKey);





async function exportLogs() {

  try {
    const {data: pets, error } = await supabase.from('pets').select('pet_id');

    if (error) {
      console.error("failed to get pet id", error);
      Alert.alert('error', 'could not get pet id')
      return;
    }

    if (!pets || pets.length === 0) {
      Alert.alert('No pets found');
      return;
    }
    for (const pet of pets) {
      console.log(`Exporting logs for pet ${pet.pet_id}`);
      const { data, error } = await supabase.functions.invoke('exportLogs', {
        body: { pet_id: pet.pet_id },
      });

      if (error || !data?.success) {
        console.error(`Failed to export logs for ${pet.pet_id}:`, error || data);
      } else {
        console.log(`Logs exported for ${pet.pet_id}`);
      }

    }


      Alert.alert('Done', 'All logs exported!');
        } catch (error) {
          console.error('Export failed', error);
          Alert.alert('Error');
  }
}



export default function ExportLogsScreen() {
  return (
    

    <View style={styles.container}>
      <Text style={styles.header}>Export Logs</Text>
      <View style={styles.center}>
        <Button title= 'Export Logs' onPress={exportLogs}  />
      {/* <Button title="Export Logs" onPress={() => exportLogs()} /> */}

      </View>
      
    </View>
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
   center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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


