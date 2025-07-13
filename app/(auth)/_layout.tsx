import { useAuth } from '@/providers/AuthProvider';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator } from 'react-native';

export default function AuthLayout() {
  const { session } = useAuth();
    if (session) {
      return <Redirect href={'/'} />;
  }
  return <Stack>
    <Stack.Screen
      name="login"
      options={{ title: 'Login', headerBackVisible: false }}
    />
    <Stack.Screen
      name="register"
      options={{ title: 'Register' }}
    />
  </Stack>;
}