import { ReactNode, useContext } from 'react';

import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { SelectedProjectContext } from '@/modules/projects/contexts/SelectedProjectContext.tsx';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';

export const SelectedProjectGuard = ({
  children,
}: {
  children: (project: ProjectPreviewEntity) => ReactNode;
}) => {
  const { project } = useContext(SelectedProjectContext);

  if (!project) {
    return <ProjectNotFound />;
  }

  return <>{children(project)}</>;
};
