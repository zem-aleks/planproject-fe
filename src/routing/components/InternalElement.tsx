import { ReactNode } from 'react';

import { AuthGuard } from '@/modules/auth/guards/AuthGuard';
import { ProjectsContextProvider } from '@/modules/projects/contexts/ProjectsContext';
import { SelectedProjectContextProvider } from '@/modules/projects/contexts/SelectedProjectContext';

export const InternalElement = ({ children }: { children: ReactNode }) => {
  return (
    <AuthGuard>
      <ProjectsContextProvider>
        <SelectedProjectContextProvider>
          {children}
        </SelectedProjectContextProvider>
      </ProjectsContextProvider>
    </AuthGuard>
  );
};
