import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { usePetData, useUpdatePet, useInsertPet } from '@/api/pets';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import KeyboardAvoidingWrapper from '@/components/KeyboardAvoidingWrapper';
import { useUsersList } from '@/api/users';
import { useAssignedUser, useAssignUserToPet, useDeassignUserFromPet } from '@/api/pets_assigned';
import { useAuth } from '@/providers/AuthProvider';
import * as FileSystem from 'expo-file-system';
import { randomUUID } from 'expo-crypto';
import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';
import RemoteImage from '@/components/RemoteImage';

export default function EditPetScreen() {
  // State for form fields
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [species, setSpecies] = useState('');
  const [location, setLocation] = useState('');
  const [breed, setBreed] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [prevPhotoUri, setPrevPhotoUri] = useState<string | null>(null);
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [status, setStatus] = useState<'available' | 'adopted' | 'fostering' | ''>('');
  const [userId, setUserId] = useState<string>('');
  const [prevUserId, setPrevUserId] = useState<string>('');
  const [prevStatus, setPrevStatus] = useState<string>('');


  const { petId } = useLocalSearchParams<{ petId: string }>();
  const isUpdating = !!petId;

  const updatingPet = isUpdating ? usePetData(petId).data : null;
  const { user: admin } = useAuth();
  const { mutate: insertPet } = useInsertPet();
  const { mutate: updatePet } = useUpdatePet();
  const { mutate: assignPet } = useAssignUserToPet();
  const { mutate: deassignPet } = useDeassignUserFromPet();
  const router = useRouter();

  // Active users list for fostering
  const { data: usersQuery } = useUsersList();
  const users = usersQuery || [];
  const usersList = useMemo(() => {
    return users.filter(user => user.active && user.approved === true);
  }, [users]);
  // Assigned user for fostering (edit mode)
  const { data: assignedUser } = useAssignedUser(isUpdating && status === 'fostering' ? petId : '');

  // Populate fields if editing
  useEffect(() => {
    if (isUpdating && updatingPet) {
      setName(updatingPet.name || '');
      setDob(updatingPet.dob ? String(updatingPet.dob) : '');
      setSpecies((updatingPet.species || '').toLowerCase());
      setLocation(updatingPet.location || '');
      setBreed(updatingPet.breed || '');
      setGender((updatingPet.gender || '').toLowerCase());
      setStatus((updatingPet.status || '').toLowerCase());
      setPrevStatus((updatingPet.status || '').toLowerCase());
      setPhotoUri(updatingPet.profile_photo || null);
      setPrevPhotoUri(updatingPet.profile_photo || null);
    }
  }, [isUpdating, updatingPet]);

  // Set assigned user when editing and status is fostering
  useEffect(() => {
    if (isUpdating && status === 'fostering' && assignedUser) {
      setUserId(assignedUser.user_id);
      setPrevUserId(assignedUser.user_id);
    }
    // If status changed from not fostering to fostering, reset userId
    if (isUpdating && prevStatus !== 'fostering' && status === 'fostering') {
      setUserId('');
    }
    // If status changed from fostering to something else, reset userId
    if (isUpdating && prevStatus === 'fostering' && status !== 'fostering') {
      setUserId('');
    }
  }, [isUpdating, status, assignedUser, prevStatus]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photos to upload pet image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (photoUri === prevPhotoUri) {
      return prevPhotoUri;
    }
    if (!photoUri?.startsWith('file://')) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(photoUri, {
      encoding: 'base64',
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = 'image/png';

    const { data, error } = await supabase.storage
      .from('pet-images')
      .upload(filePath, decode(base64), { contentType });

    console.log(error);

    if (data) {
      return data.path;
    }
  };

  const handleCreatePet = async () => {
    if (!name || !dob || !species || !location || !breed || !gender) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }
    if (status === 'fostering' && !userId) {
      Alert.alert('Missing user', 'Please select a user for fostering.');
      return;
    }
    // Upload image if selected
    const photoPath = await uploadImage();

    const insertedPet = insertPet(
      {
        name,
        dob,
        species,
        breed,
        gender,
        status: 'available', // Default to available
        location,
        profile_photo: photoPath || null,
      },
      {
        onSuccess: (data) => {
          console.log('Pet created successfully:', data);
          router.back()
          Alert.alert('Success', 'Pet created successfully!', [
            {
              text: 'OK',
            },
          ]);
        },
        onError: (error: any) => {
          Alert.alert('Error', error.message || 'Failed to create pet.');
        },
      }
    );
    console.log('Inserted Pet:', insertedPet);
  };

  const handleUpdatePet = async () => {
    if (!name || !dob || !species || !location || !breed || !gender || !status) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }
    if (status === 'fostering' && !userId) {
      Alert.alert('Missing user', 'Please select a user for fostering.');
      return;
    }
    // Upload image if selected
    const photoPath = await uploadImage();
    console.log('Photo Path:', photoPath);
    updatePet(
      {
        pet_id: petId,
        name,
        dob,
        species,
        breed,
        gender,
        status,
        location,
        profile_photo: photoPath || null,
        user_id: status === 'fostering' ? userId : null,
      },
      {
        onSuccess: () => {
          if (prevStatus === 'fostering' && status !== 'fostering') {
            // If switching from fostering to another status, deassign user
            deassignPet({ pet_id: petId, user_id: prevUserId, unassigned_by: admin.user_id, assigned: false, unassigned_at: new Date().toISOString() });
          }
          else if (status === 'fostering') {
            if (prevStatus !== 'fostering') {
              // If switching to fostering, assign user
              assignPet({ pet_id: petId, user_id: userId, assigned_by: admin.user_id, assigned: true, assigned_at: new Date().toISOString() });
            }
            else if (prevStatus === 'fostering' && prevUserId !== userId) {
              // If changing fostering user, deassign previous and assign new
              deassignPet({ pet_id: petId, user_id: prevUserId, unassigned_by: admin.user_id, assigned: false, unassigned_at: new Date().toISOString() });
              assignPet({ pet_id: petId, user_id: userId, assigned_by: admin.user_id, assigned: true, assigned_at: new Date().toISOString() });
            }

          }
          router.back()
          Alert.alert('Success', 'Pet updated!', [
            {
              text: 'OK'
            },
          ]);
        },
        onError: (error: any) => {
          Alert.alert('Error', error.message || 'Failed to update pet.');
        },
      }
    );
  };

  // Show user picker if status is fostering
  const showUserPicker = status === 'fostering';

  return (
    <KeyboardAvoidingWrapper>
      <Stack.Screen options={{ title: isUpdating ? 'Edit Pet' : 'Create Pet', headerTitleAlign: 'center' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>{isUpdating ? 'Edit Pet Profile' : 'Create Pet Profile'}</Text>

        <TouchableOpacity onPress={pickImage} style={styles.imageBox}>
          {photoUri ? (
            <RemoteImage
              path={photoUri}
              prevPath={prevPhotoUri}
              storage="pet-images"
              style={styles.photo}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>Tap to select photo</Text>
            </View>
          )}

        </TouchableOpacity>
        <Text style={styles.label}>Pet Name</Text>
        <TextInput
          placeholder="Pet Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          placeholder="YYYY-MM-DD"
          value={dob}
          onChangeText={setDob}
          style={styles.input}
        />
        <Text style={styles.label}>Species</Text>
        <TextInput
          placeholder="Species"
          value={species}
          onChangeText={setSpecies}
          style={styles.input}
        />
        <Text style={styles.label}>Breed</Text>
        <TextInput
          placeholder="Breed"
          value={breed}
          onChangeText={setBreed}
          style={styles.input}
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={gender}
            onValueChange={setGender}
            style={styles.picker}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>
        </View>
        {isUpdating && (
          <>
            <Text style={styles.label}>Status</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={status}
                onValueChange={value => {
                  setStatus(value);
                  // If status changes, update prevStatus
                  setPrevStatus(status);
                  // If switching away from fostering, clear userId
                  if (value !== 'fostering') setUserId('');
                }}
                style={styles.picker}
              >
                <Picker.Item label="Select Status" value="" />
                <Picker.Item label="Available" value="available" />
                <Picker.Item label="Adopted" value="adopted" />
                <Picker.Item label="Fostering" value="fostering" />
              </Picker>
            </View>
          </>
        )}

        {showUserPicker && (
          <>
            <Text style={styles.label}>User</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={userId}
                onValueChange={setUserId}
                style={styles.picker}
              >
                <Picker.Item label="Select User" value="" />
                {usersList.map((user: any) => (
                  <Picker.Item key={user.user_id} label={user.role === 'admin'? 
                    "Admin" + " | " + user.fname + " " + user.lname + " | " + user.email
                    : "Foster"  + " | " + user.fname + " " + user.lname + " | " + user.email} value={user.user_id} />
                ))}
              </Picker>
            </View>
          </>
        )}

        <Text style={styles.label}>Location</Text>
        <TextInput
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
        />

        <View style={styles.buttonWrapper}>
          <Button
            title={isUpdating ? "Update Pet" : "Create Pet"}
            onPress={isUpdating ? handleUpdatePet : handleCreatePet}
            color="#7c5fc9"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fdf6ff',
    flexGrow: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#7c5fc9',
    marginBottom: 24,
    textAlign: 'center',
  },
  imageBox: {
    height: 140,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // 🔹 ensures no visual crop if borderRadius is used
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // optional if you set it directly in <Image />
  },
  photoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },

  photoPlaceholderText: {
    textAlign: 'center',
    color: '#aaa'
  },
  input: {
    borderColor: '#9e7ae7',
    borderWidth: 1,
    padding: 14,
    marginBottom: 18,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 6,
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
  buttonWrapper: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
