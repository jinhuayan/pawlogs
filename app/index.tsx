import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: Navigate to the pets view on successful login
    router.push('/pets-view');
  };

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require('@/assets/ourimage/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ThemedText type="title" style={styles.title}>Login</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} />
      </View>
      <TouchableOpacity onPress={() => router.push('/register')}>
        <ThemedText style={styles.registerLink}>
          Not registered? Register here
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
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
  registerLink: {
    color: '#007AFF',
    marginTop: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});

export default LoginScreen;