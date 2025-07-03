import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { FontAwesome } from '@expo/vector-icons';
import { Redirect, router, Stack } from 'expo-router';
import { Alert, Pressable, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function UserLayout() {

  const { session } = useAuth();
  if (!session) {
    return <Redirect href={'/'} />;
  }

  const handleLogout = () => {
    supabase.auth.signOut().then(() => {
      router.push('/');
    }).catch((error) => {
      Alert.alert('Logout Error', error.message);
    });
  };

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.light.background,
        },
        headerLeft: () => null,
        headerRight: () => (
          <Pressable onPress={handleLogout}>{({ pressed }) => (
            <FontAwesome
              name="sign-out"
              size={20}
              color={Colors.light.tint}
              style={{ opacity: pressed ? 0.5 : 1 }}
            />
          )}
          </Pressable>
        ),


      }}>
      <Stack.Screen
        name="pets-view"
        options={{
          title: 'Pet Views',
          headerBackVisible: false
        }}
      />
    </Stack>
  );
}