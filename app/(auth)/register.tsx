import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Alert
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import KeyboardAvoidingWrapper from '@/components/KeyboardAvoidingWrapper';

const RegisterScreen: React.FC = () => {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState(''); // Changed from username to email
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!fname.trim() || !lname.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please fill out all fields.');
      return;
    }

    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          fname,
          lname,
          email: email,
        },
        emailRedirectTo: undefined,
      },
    });

    if (signUpError) {
      Alert.alert(signUpError.message);
      setLoading(false);
      return;
    }

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      Alert.alert(
        'Registration succeeded, but sign-out failed.',
        'Please close the app and log in again.'
      );
      setLoading(false);
      return;
    }

    Alert.alert('Registration successful!', 'You can now log in with your credentials.');
    setLoading(false);
    router.push('/login');
  }

  return (
    <KeyboardAvoidingWrapper>
      <ThemedView style={styles.container}>
        <Image
          source={require('@/assets/ourimage/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <ThemedText type="title" style={styles.title}>Register</ThemedText>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={fname}
          onChangeText={setFname}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lname}
          onChangeText={setLname}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.buttonContainer}>
          <Button
            title={loading ? 'Registering...' : 'Register'}
            onPress={handleRegister}
            disabled={loading}
          />
        </View>
      </ThemedView>
    </KeyboardAvoidingWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'transparent',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    marginBottom: 24,
  },
  input: {
    width: '100%',
    maxWidth: 300,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    marginTop: 8,
  },
});

export default RegisterScreen;
