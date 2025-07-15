import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { FontAwesome } from '@expo/vector-icons';
import { Redirect, router, Stack } from 'expo-router';
import { Alert, Pressable, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function UserLayout() {
  const { isAdmin } = useAuth();
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Logout Error', error.message);
    } else {
      router.push('/');
    }
  };
  if (!isAdmin) {
    return <Redirect href={'/'} />;
  }
  return (
    <Stack screenOptions={{
            headerStyle: {
              backgroundColor: Colors.light.background,
            },
            headerLeft: () => null,
            headerRight: () => (
              <View style={{ flexDirection: 'row', gap: 16, paddingRight: 10 }}>
                {isAdmin && (
                  <Pressable onPress={() => router.push('/(user)/pets-view')}>
                    {({ pressed }) => (
                      <FontAwesome
                        name="user"
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
          }}
        >

      <Stack.Screen
        name="admin-home"
        options={{ title: 'Admin Home', headerBackVisible: false }}
      />
      <Stack.Screen
        name="manage-pets"
        options={{ title: 'Manage Pets' }}
      />
      <Stack.Screen
        name="manage-users"
        options={{ title: 'Manage Users' }}
      />
    </Stack>
  );
}