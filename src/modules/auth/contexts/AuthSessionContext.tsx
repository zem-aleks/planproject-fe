import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { setApiAuth } from '@/modules/api/api';
import { supabase } from '@/modules/supabase/client';
import { Session } from '@supabase/auth-js';

type AuthContextData = { session: Session | null };

const emptyContextValue: AuthContextData = { session: null };

export const AuthSessionContext =
  createContext<AuthContextData>(emptyContextValue);

export const AuthSessionContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setApiAuth(session ? session.access_token : undefined);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setApiAuth(session ? session.access_token : undefined);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthSessionContext.Provider value={{ session }}>
      {children}
    </AuthSessionContext.Provider>
  );
};

export const useAuthSession = () => {
  const { session } = useContext(AuthSessionContext);
  return session;
};
