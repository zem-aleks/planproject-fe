import { ReactNode, useContext } from 'react';

import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { SelectedProjectContext } from '@/modules/projects/contexts/SelectedProjectContext.tsx';
import { ProjectEntity } from '@/modules/projects/types/entity';

export const SelectedProjectGuard = ({
  children,
}: {
  children: (project: ProjectEntity) => ReactNode;
}) => {
  const { project } = useContext(SelectedProjectContext);

  if (!project) {
    return <ProjectNotFound />;
  }

  return <>{children(project)}</>;
};
