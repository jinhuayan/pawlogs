import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { FontAwesome } from '@expo/vector-icons';
import { Redirect, router, Stack } from 'expo-router';
import { Alert, Pressable, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function UserLayout() {
const {isAdmin } = useAuth(); 
if (!isAdmin) {
    return <Redirect href={'/'} />;
}
  return (
    <Stack>
      
    </Stack>
  );
}