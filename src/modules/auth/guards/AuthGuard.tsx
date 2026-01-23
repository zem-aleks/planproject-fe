import { ReactNode } from 'react';

import { useAuthSession } from '@/modules/auth/contexts/AuthSessionContext';
import { LoginPage } from '@/modules/auth/pages/LoginPage';
import { PageLoader } from '@/modules/templates/components/PageLoader';

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { session, loaded } = useAuthSession();
  if (!loaded) {
    return <PageLoader />;
  }

  if (!session) {
    return <LoginPage />;
  }
  return <>{children}</>;
};
