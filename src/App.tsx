import { Toaster } from 'sonner';

import { AuthSessionContextProvider } from '@/modules/auth/contexts/AuthSessionContext';
import { AppRoutes } from '@/routing/components/AppRoutes.tsx';

export const App = () => {
  return (
    <AuthSessionContextProvider>
      <AppRoutes />
      <Toaster visibleToasts={1} />
    </AuthSessionContextProvider>
  );
};
