import { Toaster } from 'sonner';

import { AuthSessionContextProvider } from '@/modules/auth/contexts/AuthSessionContext';
import { ProjectsContextProvider } from '@/modules/projects/contexts/ProjectsContext.tsx';
import { SelectedProjectContextProvider } from '@/modules/projects/contexts/SelectedProjectContext';
import { AppRoutes } from '@/routing/components/AppRoutes.tsx';

export const App = () => {
  return (
    <AuthSessionContextProvider>
      <ProjectsContextProvider>
        <SelectedProjectContextProvider>
          <AppRoutes />
        </SelectedProjectContextProvider>
      </ProjectsContextProvider>
      <Toaster visibleToasts={1} />
    </AuthSessionContextProvider>
  );
};
