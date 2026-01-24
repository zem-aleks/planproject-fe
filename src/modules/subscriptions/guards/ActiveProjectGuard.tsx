import { ReactNode } from 'react';

import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { NotActivatedProjectPage } from '@/modules/projects/pages/NotActivatedProjectPage';

export const ActiveProjectGuard = ({ children }: { children: ReactNode }) => {
  const { project } = useProjectByUrlParam();

  if (!project) {
    return <ProjectNotFound />;
  }

  if (!project.activated) {
    return <NotActivatedProjectPage project={project} />;
  }

  return <>{children}</>;
};
