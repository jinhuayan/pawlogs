import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePetList } from '@/api/pets';

// ⚠️ Logs missing banner for past days
const LogsMissingBanner = () => (
  <View style={bannerStyles.banner}>
    <ThemedText style={bannerStyles.text}>
      ⚠️ No logs were submitted for this day.
    </ThemedText>
  </View>
);

const bannerStyles = StyleSheet.create({
  banner: {
    backgroundColor: '#fff3cd',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderColor: '#ffeeba',
    borderWidth: 1,
  },
  text: {
    color: '#856404',
    fontWeight: '600',
    textAlign: 'center',
  },
});

const PetCalendar: React.FC = () => {
  const router = useRouter();
  const { petId} = useLocalSearchParams<{
    petId: string;
  }>();
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const { data: petsQuery, isLoading, error } = usePetList();
  const pet = petsQuery?.find(p => p.pet_id === petId);


  // 📝 Sample logs (replace with real backend data)
  const logs = [
    { id: '1', date: '2025-07-06', category: 'Food', emoji: '🥣', time: '9:00 AM', notes: 'Ate well.' },
    { id: '2', date: '2025-07-06', category: 'Litter', emoji: '💩', time: '1:00 PM', notes: 'Cleaned litter box.' },
    { id: '3', date: '2025-06-16', category: 'Medication', emoji: '💊', time: '6:00 PM', notes: 'Gave painkiller.' },
  ];

  const markedDates = logs.reduce((acc, log) => {
    acc[log.date] = { marked: true, dotColor: '#7c5fc9' };
    return acc;
  }, {} as { [date: string]: { marked: boolean; dotColor: string } });

  const activitiesForSelectedDate = logs.filter(log => log.date === selectedDate);

  // 🚨 Show banner if selected date is in the past AND no logs exist for that date
  const isPastDate = selectedDate < today;
  const logsMissing = isPastDate && activitiesForSelectedDate.length === 0;

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Failed to fetch Pets</Text>;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        {pet.emoji || '🐾'} {pet.name} - Activity Calendar
      </ThemedText>

      <TouchableOpacity
        style={styles.viewAllLogsButton}
        onPress={() =>
          router.push({
            pathname: '/pet-activity',
            params: { petId, name: pet.name, emoji: pet.emoji || '🐾' },
          })
        }
      >
        <ThemedText style={styles.viewAllLogsButtonText}>View All Logs</ThemedText>
      </TouchableOpacity>

      <Calendar
        current={selectedDate}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            ...(markedDates[selectedDate] || {}),
            selected: true,
            selectedColor: '#7c5fc9',
          },
        }}
        onDayPress={handleDayPress}
        theme={{
          selectedDayBackgroundColor: '#7c5fc9',
          todayTextColor: '#7c5fc9',
          arrowColor: '#7c5fc9',
          dotColor: '#7c5fc9',
        }}
        style={styles.calendar}
      />

      {/* 🚨 Show banner if selected past date has no logs */}
      {logsMissing && <LogsMissingBanner />}

      <FlatList
        data={activitiesForSelectedDate}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/edit-log',
                params: {
                  id: item.id,
                  category: item.category,
                  notes: item.notes,
                  timestamp: `${selectedDate} ${item.time}`,
                },
              })
            }
          >
            <View style={styles.iconCircle}>
              <ThemedText style={styles.iconText}>{item.emoji}</ThemedText>
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.activityCategory}>{item.category}</ThemedText>
              <ThemedText style={styles.activityTime}>Time: {item.time}</ThemedText>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <ThemedText style={{ textAlign: 'center', marginTop: 24, color: '#aaa' }}>
            No activities logged for this day.
          </ThemedText>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push(`/add-log?petId=${petId}`)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf9fa', padding: 16, paddingTop: 32 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  calendar: {
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f2fa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6d6fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: { fontSize: 22 },
  activityCategory: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 14,
    color: '#555',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#7c5fc9',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  viewAllLogsButton: {
    marginBottom: 16,
    backgroundColor: '#7c5fc9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewAllLogsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PetCalendar;
