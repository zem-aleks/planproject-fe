import { ReactNode, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { toast } from 'sonner';

import { updateProject } from '@/modules/projects/api/updateProject';
import { ProjectForm } from '@/modules/projects/components/forms/ProjectForm.tsx';
import { ProjectsContext } from '@/modules/projects/contexts/ProjectsContext.tsx';
import {
  ProjectCreateData,
  ProjectEntity,
} from '@/modules/projects/types/entity';
import { notReachable } from '@/utils/notReachable.ts';
import { useMutation } from '@tanstack/react-query';

export const ProjectEditForm = ({
  project,
}: {
  project: ProjectEntity;
}): ReactNode => {
  const { reload } = useContext(ProjectsContext);
  const navigate = useNavigate();
  const { status, data, error, mutate, reset } = useMutation({
    mutationFn: (params: ProjectCreateData & { id: string }) =>
      updateProject(params),
  });

  useEffect(() => {
    switch (status) {
      case 'idle':
      case 'pending':
        break;

      case 'success':
        reset();
        reload();
        toast.success(`Project "${data!.title}" updated successfully!`);
        navigate('/projects');
        break;

      case 'error':
        toast.error(`Failed to create project: ${error!.message}`);
        break;

      default:
        return notReachable(status);
    }
  }, [status, reset, navigate, reload]);

  return (
    <ProjectForm
      defaultValues={project}
      onSubmit={(data) => mutate({ ...data, id: project.id })}
    />
  );
};
