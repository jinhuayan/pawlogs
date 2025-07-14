import { supabase } from '@/lib/supabase';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { queryClient } from '@/providers/QueryProvider';
import { Alert } from 'react-native';

type AuthData = {
  session: Session | null;
  user: any | null;
  loading: boolean;
  isAdmin: boolean;
};

// Create AuthContext with default values
const AuthContext = createContext<AuthData>({
  session: null,
  user: null,
  loading: true,
  isAdmin: false,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to fetch user data from Supabase
  const fetchUser = async (session: Session | null) => {
    if (session) {
      console.log('Fetching user data for:', session.user.id);
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      setUser(data || null);

    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // Initial session fetch
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Initial session:', session);
      setSession(session);
      await fetchUser(session);
      setLoading(false);
    };
    fetchSession();

    // Listen for auth state changes
    // Fix for first time registration so it doesn't auto login by adding approved: yes/no condition
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session) => {
        console.log('Auth state changed:', _event);
        setLoading(true);
        setSession(session);
        await fetchUser(session);
        setLoading(false);
        if (!session) {
        queryClient.clear(); // Clear cache on logout
      }
      }
    );

    // Cleanup listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const contextValue = useMemo(() => ({
  session,
  user,
  loading,
  isAdmin: user?.role === 'admin',
}), [session, user, loading]);

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);