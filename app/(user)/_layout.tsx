import { FontAwesome } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import { Pressable } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function UserLayout() {

  return <Stack
    screenOptions={{
      headerRight: () => (
        <Pressable>
          {({ pressed }) => (
            <FontAwesome
              name="user"
              size={23}
              color={Colors.light.tint}
              style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
            />
          )}
        </Pressable>
      )
    }}>
    <Stack.Screen
      name="pets-view"
      options={{
        title: 'Pet Views'
      }}
    />
  </Stack>;
}