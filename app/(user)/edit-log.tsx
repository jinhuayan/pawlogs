import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import KeyboardAvoidingWrapper from '@/components/KeyboardAvoidingWrapper';
import { usePetActivity, useInsertActivity, useUpdateActivity, useDeleteActivity } from '@/api/activity';
import { useCategories } from '@/api/categories';
import { useAuth } from '@/providers/AuthProvider';
import * as ImagePicker from 'expo-image-picker';

const EditLogScreen: React.FC = () => {
  const router = useRouter();
  const { activityId, petId, date } = useLocalSearchParams<{
    activityId?: string;
    petId?: string;
    date?: string;
  }>();

  const isUpdating = !!activityId;
  const isAdding = !!petId && !!date;
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: activityData } = usePetActivity(activityId || '');
  const { data: categoryData } = useCategories();
  const { mutate: insertLog } = useInsertActivity();
  const { mutate: updateLog } = useUpdateActivity();
  const { mutate: deleteLog } = useDeleteActivity();
  const { user } = useAuth();

  const [logDate, setLogDate] = useState(() =>
    isAdding && date ? new Date(`${date}T09:00:00`) : new Date()
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [category1, setCategory1] = useState('');
  const [category2, setCategory2] = useState('');
  const [comment, setComment] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    if (isUpdating && activityData) {
      setLogDate(new Date(activityData.event_time));
      setCategory1(activityData.category_1_id);
      setCategory2(activityData.category_2_id);
      setComment(activityData.comment || '');
      setPhotoUri(activityData.image || null);
    }
  }, [activityData]);

  const subCategoryOptions = useMemo(() => {
    if (!categoryData) return [];
    return categoryData.category_2.filter(
      (sub: any) => sub.category_1_id === Number(category1)
    );
  }, [category1, categoryData]);

  const selectedPrimaryEmoji = useMemo(() => {
    const match = categoryData?.category_1.find((cat: any) => cat.id === category1);
    return match?.emoji || '';
  }, [category1, categoryData]);

  const selectedSubEmoji = useMemo(() => {
    const match = categoryData?.category_2.find((sub: any) => sub.id === category2);
    return match?.emoji || '';
  }, [category2, categoryData]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!category1 || !category2) {
      Alert.alert('Missing Category', 'Please select both primary and sub category.');
      return;
    }
    const log = {
      pet_id: petId,
      event_time: logDate.toISOString(),
      category_1_id: category1,
      category_2_id: category2,
      comment,
      image: photoUri,
    };
    if (isUpdating && activityData) {
      updateLog(
        {
          ...log,
          activity_id: activityId,
          updated_by: user.user_id,
          updated_at: new Date().toISOString(),
        },
        {
          onSuccess: () => {
            router.back()
            Alert.alert('Success', 'Activity updated!', [
              {
                text: 'OK'
              },
            ]);
          },
          onError: (err: any) => Alert.alert('Error', err.message || 'Failed to update log'),
        }
      );
    } else if (isAdding) {
      insertLog(
        {
          ...log,
          created_by: user.user_id,
          created_at: new Date().toISOString(),
          updated_by: user.user_id,
          updated_at: new Date().toISOString(),
        },
        {
          onSuccess: () => {
            router.back()
            Alert.alert('Success', 'Activity Inserted!', [
              {
                text: 'OK'
              },
            ]);
          },
          onError: (err: any) => Alert.alert('Error', err.message || 'Failed to create log'),
        }
      );
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Log', 'Are you sure you want to delete this log?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          if (activityId) {
            setIsDeleting(true); // 🔹 Start loading
            deleteLog(activityId, {
              onSuccess: () => {
                setIsDeleting(false); // 🔹 End loading
                router.back();
                Alert.alert('Success', 'Activity Deleted!');
              },
              onError: (err: any) => {
                setIsDeleting(false); // 🔹 End loading even if error
                Alert.alert('Error', err.message || 'Failed to delete log');
              },
            });
          }
        },
      },
    ]);
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingWrapper>


        <Stack.Screen options={{ title: isUpdating ? 'Edit Log' : 'Add Log', headerTitleAlign: 'center' }} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {isDeleting && (
            <View style={styles.loadingOverlay}>
              <Text style={styles.loadingText}>Deleting...</Text>
            </View>
          )}
          <Text style={styles.label}>🖼 Photo</Text>
          <TouchableOpacity onPress={pickImage} style={styles.imageBox}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={{ width: '100%', height: 140, borderRadius: 10 }} />
            ) : (
              <Text style={{ textAlign: 'center', color: '#aaa' }}>Tap to upload image</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>📅 Date & Time</Text>
          <View style={styles.inputBox}><Text>{logDate.toLocaleString()}</Text></View>
          <TouchableOpacity style={styles.changeTimeButton} onPress={() => setShowTimePicker(true)}>
            <Text style={styles.changeTimeText}>⏱ Change Time</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={logDate}
              mode="time"
              display="default"
              onChange={(_e, time) => {
                time && setLogDate(new Date(logDate.setHours(time.getHours(), time.getMinutes())));
                _e.type === 'set' && setShowTimePicker(false);
                _e.type === 'dismissed' && setShowTimePicker(false);
              }}
            />
          )}

          <Text style={styles.label}>{selectedPrimaryEmoji} Primary Category </Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={category1}
              style={styles.picker}
              onValueChange={(val) => {
                setCategory1(val);
                setCategory2('');
              }}>
              <Picker.Item label="Select primary" value="" />
              {categoryData?.category_1.map((cat: any) => (
                <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>{selectedSubEmoji}Sub Category</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={category2}
              style={styles.picker}
              enabled={!!category1}
              onValueChange={setCategory2}
            >
              <Picker.Item label={category1 ? 'Select subcategory' : 'Select primary first'} value="" />
              {subCategoryOptions.map((sub: any) => (
                <Picker.Item key={sub.id} label={sub.name} value={sub.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>🗒 Notes</Text>
          <TextInput
            style={[styles.inputBox, styles.notesInput]}
            value={comment}
            onChangeText={setComment}
            multiline
            placeholder="Optional notes about this activity"
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>💾 Save</Text>
          </TouchableOpacity>

          {isUpdating && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>🗑 Delete Log</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: { padding: 24, paddingBottom: 140 },
  label: { fontSize: 16, fontWeight: '500', marginTop: 12, marginBottom: 6 },
  inputBox: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 10,
    padding: 12, backgroundColor: '#faf9fa', marginBottom: 8,
  },
  pickerWrapper: {
    borderColor: '#9e7ae7',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 18,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  notesInput: { minHeight: 70, textAlignVertical: 'top' },
  changeTimeButton: {
    backgroundColor: '#e0d4fa', paddingVertical: 10, borderRadius: 10,
    alignItems: 'center', marginBottom: 12,
  },
  changeTimeText: { color: '#5a3db4', fontWeight: 'bold' },
  imageBox: {
    height: 140,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f0eefc',
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#7c5fc9', paddingVertical: 18, borderRadius: 40,
    alignItems: 'center', marginTop: 24,
  },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  deleteButton: {
    backgroundColor: '#eee', paddingVertical: 14, borderRadius: 40,
    alignItems: 'center', marginTop: 16,
  },
  deleteButtonText: { color: '#e53935', fontWeight: 'bold', fontSize: 16 },
  loadingOverlay: {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
},
loadingText: {
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 12,
  fontSize: 18,
  fontWeight: 'bold',
  color: '#7c5fc9',
},

});

export default EditLogScreen;
