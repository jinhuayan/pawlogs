

import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { ExportProvider } from '../providers/ExportProvider'
import { ExportButton } from '../components/ui/ExportButton'

const testLogs = [
  {
    petId: 'a1b2c3d4-e5f6-7a8b-9c0d-ef1234567890',
    date: '2025-06-27',
    food: '50g dry kibble',
    water: '200ml fresh',
    litter: '1 scoop clean',
    meds: ['Flea pill'],
    notes: 'Very playful and ate everything.'
  },
  {
    petId: 'b2c3d4e5-f6a7-8b9c-0def-1234567890ab',
    date: '2025-06-27',
    food: '30g wet food',
    water: '150ml',
    litter: 'Clean',
    meds: [],
    notes: 'Quiet today, refused wet food.'
  },
]

export default function RootLayout() {
  return (

    
    <ExportProvider>
        Export to Google Sheets!
        
        <SafeAreaView style={styles.container}>
            <ExportButton logs={testLogs} />
        </SafeAreaView>

    </ExportProvider>
    

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})