import { ReactNode } from 'react';

import { useAuthSession } from '@/modules/auth/contexts/AuthSessionContext';
import { LoginPage } from '@/modules/auth/pages/LoginPage';

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const session = useAuthSession();
  if (!session) {
    return <LoginPage />;
  }
  return <>{children}</>;
};
