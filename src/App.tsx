import { Toaster } from 'sonner';

import { queryClient } from '@/lib/queryClient';
import { AuthSessionContextProvider } from '@/modules/auth/contexts/AuthSessionContext';
import { AppRoutes } from '@/routing/components/AppRoutes.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionContextProvider>
        <AppRoutes />
        <Toaster visibleToasts={1} />
      </AuthSessionContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
