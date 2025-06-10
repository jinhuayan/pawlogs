import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerCode, setRegisterCode] = useState('');

  const handleRegister = () => {
    // TODO: register the user with the provided details
    alert(`Registered as ${name} (${username}) with code: ${registerCode}`);
  };

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require('@/assets/ourimage/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ThemedText type="title" style={styles.title}>Register</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Register Code"
        value={registerCode}
        onChangeText={setRegisterCode}
      />
      <View style={styles.buttonContainer}>
        <Button title="Register" onPress={handleRegister} />
      </View>
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
});

export default RegisterScreen;