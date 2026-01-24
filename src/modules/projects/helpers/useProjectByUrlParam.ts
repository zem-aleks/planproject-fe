import { useContext } from 'react';
import { useParams } from 'react-router';

import { ProjectsContext } from '@/modules/projects/contexts/ProjectsContext';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';

export const useProjectByUrlParam = (): {
  project: ProjectPreviewEntity | null;
  reload: () => void;
} => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, reload } = useContext(ProjectsContext);
  if (!projectId) {
    // console.error('Project ID is required');
    return { project: null, reload };
  }

  const project = projects.find((project) => project.id === projectId) || null;
  return { project, reload };
};
