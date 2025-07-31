import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { usePetData, useUpdatePet } from '@/api/pets';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useInsertPet } from '@/api/pets';
import KeyboardAvoidingWrapper from '@/components/KeyboardAvoidingWrapper';

export default function EditPetScreen() {
  // State for form fields
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [species, setSpecies] = useState('');
  const [location, setLocation] = useState('');
  const [breed, setBreed] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [status, setStatus] = useState<'available' | 'adopted' | 'fostering' | ''>('');

  const { petId } = useLocalSearchParams<{ petId: string }>();
  const isUpdating = !!petId;

  const updatingPet = isUpdating ? usePetData(petId).data : null;
  const { mutate: insertPet } = useInsertPet();
  const { mutate: updatePet } = useUpdatePet();
  const router = useRouter();

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
      // setPhotoUri(updatingPet.profile_photo || null);
    }
  }, [isUpdating, updatingPet]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photos to upload pet image.');
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

  const handleCreatePet = async () => {
    if (!name || !dob || !species || !location || !breed || !gender || !status) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }
    insertPet(
      {
        name,
        dob,
        species,
        breed,
        gender,
        status,
        location,
        profile_photo: photoUri || null,
      },
      {
        onSuccess: () => {
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
  };
  // Add this function for updating
  const handleUpdatePet = async () => {
    if (!name || !dob || !species || !location || !breed || !gender || !status) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }

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
        profile_photo: photoUri || null,
      },
      {
        onSuccess: () => {
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

  return (
    
    <KeyboardAvoidingWrapper>
      <Stack.Screen options={{ title: isUpdating ? 'Edit Pet' : 'Create Pet' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>{isUpdating ? 'Edit Pet Profile' : 'Create Pet Profile'}</Text>

        <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>Tap to upload photo</Text>
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

        <Text style={styles.label}>Status</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={status}
            onValueChange={setStatus}
            style={styles.picker}
          >
            <Picker.Item label="Select Status" value="" />
            <Picker.Item label="Available" value="available" />
            <Picker.Item label="Adopted" value="adopted" />
            <Picker.Item label="Fostering" value="fostering" />
          </Picker>
        </View>

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
  photoContainer: {
    alignSelf: 'center',
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    width: 180,
    height: 140,
    backgroundColor: '#e6d6fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#9e7ae7',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    color: '#7c5fc9',
    fontSize: 16,
    fontWeight: '600',
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
    height: 48,
    width: '100%',
  },
  buttonWrapper: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
