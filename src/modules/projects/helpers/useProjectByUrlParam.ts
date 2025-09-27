import { useContext } from 'react';
import { useParams } from 'react-router';

import { ProjectsContext } from '@/modules/projects/contexts/ProjectsContext';
import { ProjectEntity } from '@/modules/projects/types/entity';

export const useProjectByUrlParam = (): ProjectEntity | null => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects } = useContext(ProjectsContext);
  if (!projectId) {
    console.error('Project ID is required');
    return null;
  }

  return projects.find((project) => project.id === projectId) || null;
};
