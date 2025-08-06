// ✅ PetCalendar updated with useAllPetActivity, calendar-linked logs, and conditional "View All Logs" mode

import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAllPetActivity } from '@/api/activity'; // ✅ Custom hook
import { calculateAge } from '@/utils/calculateAge';

const LogsMissingBanner = () => (
  <View style={bannerStyles.banner}>
    <ThemedText style={bannerStyles.text}>
      ⚠️ No logs were submitted for this day.
    </ThemedText>
  </View>
);

const bannerStyles = StyleSheet.create({
  banner: {
    backgroundColor: '#fff3cd', padding: 12, marginBottom: 12,
    borderRadius: 8, borderColor: '#ffeeba', borderWidth: 1,
  },
  text: { color: '#856404', fontWeight: '600', textAlign: 'center' },
});

const PetCalendar: React.FC = () => {
  const router = useRouter();
  const { petId, name, emoji, dob } = useLocalSearchParams<{ petId: string; name: string; emoji: string, dob: string; }>();
  const petAge = calculateAge(dob as any)
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [viewAll, setViewAll] = useState(false);
  const { data: activityLogs, isLoading, error } = useAllPetActivity(petId);

  const logsByDate = useMemo(() => {
    if (!activityLogs) return {};
    return activityLogs.reduce((acc: Record<string, any[]>, log: any) => {
      const date = log.event_time.split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(log);
      return acc;
    }, {});
  }, [activityLogs]);

  const markedDates = useMemo(() => {
    const result: any = {};
    for (const date in logsByDate) {
      result[date] = { marked: true, dotColor: '#7c5fc9' };
    }
    if (selectedDate) {
      result[selectedDate] = { ...(result[selectedDate] || {}), selected: true, selectedColor: '#7c5fc9' };
    }
    return result;
  }, [logsByDate, selectedDate]);

  const activitiesForSelectedDate = viewAll ? activityLogs || [] : logsByDate[selectedDate] || [];
  const isPastDate = selectedDate < today;
  const logsMissing = !viewAll && isPastDate && activitiesForSelectedDate.length === 0;

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Failed to fetch activity logs</Text>;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: viewAll ? 'All Logs' : 'Activity Calendar', headerTitleAlign: 'center' }} />
      <ThemedText type="title" style={styles.header}>
        {emoji || '🐾'} {name} - Age {petAge}
      </ThemedText>


      <TouchableOpacity style={styles.viewAllLogsButton} onPress={() => setViewAll(prev => !prev)}>
        <ThemedText style={styles.viewAllLogsButtonText}>
          {viewAll ? 'Back to Calendar View' : 'View All Logs'}
        </ThemedText>
      </TouchableOpacity>

      {!viewAll && (
        <Calendar
          current={selectedDate}
          markedDates={markedDates}
          onDayPress={day => setSelectedDate(day.dateString)}
          minDate={dob} // ✅ disables dates before DOB
          theme={{
            selectedDayBackgroundColor: '#7c5fc9',
            todayTextColor: '#7c5fc9',
            arrowColor: '#7c5fc9',
            dotColor: '#7c5fc9',
          }}
          style={styles.calendar}
        />
      )}

      {logsMissing && <LogsMissingBanner />}

      <FlatList
        data={activitiesForSelectedDate}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => {
          const date = item.event_time.split('T')[0];
          const time = new Date(item.event_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/edit-log?activityId=${item.id}`)}
            >
              <View style={styles.iconCircle}>
                <ThemedText style={styles.iconText}>{item.category_1_emoji || '📌'}</ThemedText>
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.activityCategory}>{item.category_1_name}</ThemedText>
                <ThemedText style={styles.activityTime}>Time: {time}</ThemedText>
                {viewAll && <ThemedText style={styles.activityDate}>Date: {date}</ThemedText>}
                {item.comment && <ThemedText>{item.comment}</ThemedText>}
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <ThemedText style={{ textAlign: 'center', marginTop: 24, color: '#aaa' }}>
            No activities logged {viewAll ? 'yet.' : 'for this day.'}
          </ThemedText>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push(`/edit-log?petId=${petId}&date=${encodeURIComponent(selectedDate)}`)}
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
    borderRadius: 16, marginBottom: 16, backgroundColor: '#fff', elevation: 2,
  },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f2fa',
    borderRadius: 16, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#eee',
  },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#e6d6fa',
    alignItems: 'center', justifyContent: 'center', marginRight: 16,
  },
  iconText: { fontSize: 22 },
  activityCategory: { fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  activityTime: { fontSize: 14, color: '#555' },
  activityDate: { fontSize: 14, color: '#777' },
  fab: {
    position: 'absolute', bottom: 30, right: 30, backgroundColor: '#7c5fc9',
    width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 4,
  },
  viewAllLogsButton: {
    marginBottom: 16, backgroundColor: '#7c5fc9', padding: 12,
    borderRadius: 8, alignItems: 'center',
  },
  viewAllLogsButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default PetCalendar;