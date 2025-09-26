import { ReactNode, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { toast } from 'sonner';

import { createProject } from '@/modules/projects/api/createProject.ts';
import { ProjectForm } from '@/modules/projects/components/forms/ProjectForm.tsx';
import { ProjectsContext } from '@/modules/projects/contexts/ProjectsContext.tsx';
import { ProjectCreateData } from '@/modules/projects/types/entity';
import { notReachable } from '@/utils/notReachable.ts';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData.ts';

const DEFAULT_VALUES: ProjectCreateData = {
  title: '',
  description: null,
  logoUrl: null,
};

export const ProjectCreateForm = (): ReactNode => {
  const { reload } = useContext(ProjectsContext);
  const navigate = useNavigate();
  const { state, load, reset } = useLazyLoadableData(createProject);

  useEffect(() => {
    switch (state.type) {
      case 'not_requested':
      case 'loading':
        break;

      case 'loaded':
        reset();
        reload();
        toast.success(`Project "${state.data.title}" created successfully!`);
        navigate('/projects');
        break;

      case 'error':
        toast.error(`Failed to create project: ${state.error.message}`);
        break;

      default:
        return notReachable(state);
    }
  }, [state, reset, navigate, reload]);

  return <ProjectForm defaultValues={DEFAULT_VALUES} onSubmit={load} />;
};
