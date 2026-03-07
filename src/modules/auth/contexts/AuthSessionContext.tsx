import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { v4 as uuidv4 } from 'uuid';

import { setApiAuth } from '@/modules/api/api';
import { supabase } from '@/modules/supabase/client';
import { Session } from '@supabase/auth-js';

type AuthContextData = {
  session: Session | null;
  clientId: string;
  loaded: boolean;
};

const emptyContextValue: AuthContextData = {
  session: null,
  clientId: '',
  loaded: false,
};

export const AuthSessionContext =
  createContext<AuthContextData>(emptyContextValue);

export const AuthSessionContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const clientId = useMemo(
    () => localStorage.getItem('clientId') || uuidv4(),
    [],
  );
  localStorage.setItem('clientId', clientId);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setApiAuth(session ? session.access_token : undefined);
      setLoaded(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthSessionContext.Provider value={{ session, clientId, loaded }}>
      {children}
    </AuthSessionContext.Provider>
  );
};

export const useAuthSession = () => {
  return useContext(AuthSessionContext);
};
