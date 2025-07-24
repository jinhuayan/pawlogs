import { useAuth } from '@/providers/AuthProvider';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Redirect, router, Stack } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import MyProfileModal from '@/components/MyProfile';
import { useState } from 'react';

export default function UserLayout() {
  const { isAdmin } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  if (!isAdmin) {
    return <Redirect href={'/'} />;
  }

  return (
    <>
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
            <Pressable onPress={() => setShowProfile(true)}>
              {({ pressed }) => (
                <AntDesign
                  name="setting"
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
        <Stack.Screen
          name="edit-user"
          options={{ title: 'Edit User' }}
        />
      </Stack>
      <MyProfileModal visible={showProfile} onClose={() => setShowProfile(false)} />
    </>
  );
}