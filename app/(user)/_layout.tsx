import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { FontAwesome } from '@expo/vector-icons';
import { Redirect, router, Stack } from 'expo-router';
import { Alert, Pressable, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function UserLayout() {

  const { session, user, isAdmin } = useAuth();
  console.log('User Details:', user);
  console.log('Is Admin:', isAdmin);
  
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
          <View style={{ flexDirection: 'row', gap: 16, paddingRight: 10 }}>
            {isAdmin && (
              <Pressable onPress={() => router.push('/(admin)/admin-home')}>
                {({ pressed }) => (
                  <FontAwesome
                    name="gear"
                    size={20}
                    color={Colors.light.tint}
                    style={{ opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            )}
            <Pressable onPress={handleLogout}>
              {({ pressed }) => (
                <FontAwesome
                  name="sign-out"
                  size={20}
                  color={Colors.light.tint}
                  style={{ opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </View>
        ),


      }}>
      <Stack.Screen
        name="pets-view"
        options={{
          title: 'Pet Views',
          headerBackVisible: false
        }}
      />
      <Stack.Screen name="(admin)" options={{ headerShown: false }} />
    </Stack>
  );
}