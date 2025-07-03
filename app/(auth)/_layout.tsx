import { useAuth } from '@/providers/AuthProvider';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const { session } = useAuth();

  if (session) {
    return <Redirect href={'/'} />;
  }

  return <Stack>
    <Stack.Screen
      name="login"
      options={{ title: 'Sign in' }}
    />
    <Stack.Screen
      name="register"
      options={{ title: 'Register' }}
    />
  </Stack>;
}