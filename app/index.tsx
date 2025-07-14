import { useAuth } from '@/providers/AuthProvider';
import { Redirect } from 'expo-router';
import { ActivityIndicator } from 'react-native';

const index = () => {
  const { session, loading } = useAuth();

  if (loading) {
    console.log('Index: Loading index state...');
    return <ActivityIndicator />;
  }
  else {
    if (!session) {
      console.log('Index: User is not authenticated, redirecting to login');
      return <Redirect href={'/(auth)/login'} />; // Redirect to login if not authenticated
    }
    else {
      console.log('Index: User is authenticated, redirecting to pets-view');
      return <Redirect href={'/(user)/pets-view'} />; // Redirect to home if already logged in
    }
  }
}

export default index;