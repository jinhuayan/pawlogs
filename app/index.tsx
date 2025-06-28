import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import KeyboardAvoidingWrapper from '@/components/KeyboardAvoidingWrapper';

import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';

const LoginScreen: React.FC = () => {
  const { session } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Setup Android notification channel for Expo SDK 53+
  useEffect(() => {
    const setupNotificationChannel = async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    };
    setupNotificationChannel();
  }, []);

  // Show loading spinner
  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  // Redirect if already logged in
  if (session) {
    router.push('/pets-view');
  }

  // Ask for notification permission (SDK 53+)
  const askNotificationPermission = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    if (existingStatus !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        Alert.alert('Permission required', 'Please enable notifications to receive reminders.');
      }
    }
  };

  // Remind only if 24h have passed
  const remindDailyAfterLogin = async () => {
    const LAST_REMINDER_KEY = 'LAST_DAILY_FOSTER_REMINDER';
    const last = await SecureStore.getItemAsync(LAST_REMINDER_KEY);
    const lastDate = last ? new Date(last) : null;
    const now = new Date();
    const hoursSince = lastDate ? (now.getTime() - lastDate.getTime()) / 36e5 : Infinity;

    if (hoursSince >= 24) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🐾 Log Reminder',
          body: 'Don’t forget to log your foster pet’s activities today!',
          sound: true,
        },
        trigger: null, // fire immediately
      });

      await SecureStore.setItemAsync(LAST_REMINDER_KEY, now.toISOString());
    }
  };

  // Login function with reminder
  async function handleLogin() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      await askNotificationPermission();
      await remindDailyAfterLogin();
      router.push('/pets-view');
    }

    setLoading(false);
  }

  return (
    <KeyboardAvoidingWrapper>
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
  registerLink: {
    color: '#007AFF',
    marginTop: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});

export default LoginScreen;
