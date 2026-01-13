import { ReactNode } from 'react';

import { UserContextProvider } from '@/modules/auth/contexts/UserContext';
import { AuthGuard } from '@/modules/auth/guards/AuthGuard';
import { ProjectsContextProvider } from '@/modules/projects/contexts/ProjectsContext';
import { SelectedProjectContextProvider } from '@/modules/projects/contexts/SelectedProjectContext';

export const InternalElement = ({ children }: { children: ReactNode }) => {
  return (
    <AuthGuard>
      <UserContextProvider>
        <ProjectsContextProvider>
          <SelectedProjectContextProvider>
            {children}
          </SelectedProjectContextProvider>
        </ProjectsContextProvider>
      </UserContextProvider>
    </AuthGuard>
  );
};
