import { useAuth } from '@/providers/AuthProvider';
import { Redirect} from 'expo-router';
import { ActivityIndicator } from 'react-native';

const index = () => {
  const { session, user, loading } = useAuth();

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!session) {
    return <Redirect href={'(auth)/login'} />; // Redirect to home if already logged in
  }
  return <Redirect href={'(user)/pets-view'} />;
}

export default index;