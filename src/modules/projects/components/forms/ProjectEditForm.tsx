import { ReactNode, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { toast } from 'sonner';

import { updateProject } from '@/modules/projects/api/updateProject';
import { ProjectForm } from '@/modules/projects/components/forms/ProjectForm.tsx';
import { ProjectsContext } from '@/modules/projects/contexts/ProjectsContext.tsx';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { notReachable } from '@/utils/notReachable.ts';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData.ts';

export const ProjectEditForm = ({
  project,
}: {
  project: ProjectEntity;
}): ReactNode => {
  const { reload } = useContext(ProjectsContext);
  const navigate = useNavigate();
  const { state, load, reset } = useLazyLoadableData(updateProject);

  useEffect(() => {
    switch (state.type) {
      case 'not_requested':
      case 'loading':
        break;

      case 'loaded':
        reset();
        reload();
        toast.success(`Project "${state.data.title}" updated successfully!`);
        navigate('/projects');
        break;

      case 'error':
        toast.error(`Failed to create project: ${state.error.message}`);
        break;

      default:
        return notReachable(state);
    }
  }, [state, reset, navigate, reload]);

  return (
    <ProjectForm
      defaultValues={project}
      onSubmit={(data) => load({ ...data, id: project.id })}
    />
  );
};
