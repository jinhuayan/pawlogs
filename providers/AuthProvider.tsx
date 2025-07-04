import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import {PropsWithChildren, createContext, use, useContext, useEffect, useState} from 'react';

type AuthData = {
  session: Session | null;
  loading: boolean;
};

const AuthContext = createContext<AuthData>({
  session: null,
  loading: true,
});

export default function uthProvider({children}: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSession = async () => {
      const {data, error} = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    }

  }, []);

  // For now, we just provide an empty context
  return (
    <AuthContext.Provider value={{session, loading}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () =>useContext(AuthContext);