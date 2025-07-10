import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { PropsWithChildren, createContext, use, useContext, useEffect, useState } from 'react';

type AuthData = {
  session: Session | null;
  user: any;
  loading: boolean;
  isAdmin: boolean
};

const AuthContext = createContext<AuthData>({
  session: null,
  user: null,
  loading: true,
  isAdmin: false,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);


      if (session) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        setUser(data || null);
      }
      setLoading(false);

    };

    fetchSession();
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

  }, []);
  console.log(user);
  return (
    <AuthContext.Provider value={{ session, user, loading, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);