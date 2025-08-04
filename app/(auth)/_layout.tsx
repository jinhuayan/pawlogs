import { useAuth } from '@/providers/AuthProvider';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator } from 'react-native';

export default function AuthLayout() {
  const { user } = useAuth();
    if (user) {
      return <Redirect href={'/'} />;
  }
  return <Stack>
    <Stack.Screen
      name="login"
      options={{ title: 'Login', headerBackVisible: false, headerTitleAlign: 'center' }}
    />
    <Stack.Screen
      name="register"
      options={{ title: 'Register', headerTitleAlign: 'center' }}
    />
  </Stack>;
}