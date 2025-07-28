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
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { usePetData } from '@/api/pets';
import { useLocalSearchParams } from 'expo-router';

export default function EditPetScreen() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const isUpdating = !!petId;

  const pet = isUpdating ? usePetData(petId).data : null;

  // State for form fields
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [species, setSpecies] = useState('');
  const [fosterName, setFosterName] = useState('');
  const [breed, setBreed] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // Populate fields if editing
  useEffect(() => {
    if (isUpdating && pet) {
      setName(pet.name || '');
      setDob(pet.dob ? String(pet.dob) : '');
      setSpecies(pet.species || '');
      setFosterName(pet.location || '');
      setBreed(pet.breed || '');
      // If you have photoUri in pet, set it here
      // setPhotoUri(pet.photoUri || null);
    }
  }, [isUpdating, pet]);

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

  const handleSubmit = () => {
    if (!name || !dob || !species || !fosterName || !breed) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }

    Alert.alert(
      isUpdating ? 'Pet Updated' : 'Pet Created',
      `Name: ${name}\nDob: ${dob}\nBreed: ${breed}\nSpecies: ${species}\nFoster: ${fosterName}`
    );

    // TODO: replace with Supabase insert/update logic later
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={{ flex: 1 }}
    >
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
        <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 6 }}>Pet Name</Text>
        <TextInput
          placeholder="Pet Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 6 }}>Date of Birth</Text>
        <TextInput
          placeholder="Date of Birth"
          value={dob}
          onChangeText={setDob}
          style={styles.input}
        />
        <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 6 }}>Species</Text>
        <TextInput
          placeholder="Species"
          value={species}
          onChangeText={setSpecies}
          style={styles.input}
        />
        <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 6 }}>Breed</Text>
        <TextInput
          placeholder="Breed"
          value={breed}
          onChangeText={setBreed}
          style={styles.input}
        />
        <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 6 }}>Foster Location</Text>
        <TextInput
          placeholder="Foster Location"
          value={fosterName}
          onChangeText={setFosterName}
          style={styles.input}
        />

        <View style={styles.buttonWrapper}>
          <Button title="Submit" onPress={handleSubmit} color="#7c5fc9" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  buttonWrapper: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
