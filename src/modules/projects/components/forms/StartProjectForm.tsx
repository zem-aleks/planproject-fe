import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { toast } from 'sonner';

import { startProject } from '@/modules/projects/api/startProject';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { Button } from '@/ui/button';
import { notReachable } from '@/utils/notReachable';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData';

export const StartProjectForm = ({
  project,
  onStarted,
}: {
  project: ProjectEntity;
  onStarted: () => void;
}) => {
  const navigate = useNavigate();
  const { state, load } = useLazyLoadableData(startProject);

  useEffect(() => {
    switch (state.type) {
      case 'not_requested':
      case 'loading':
        break;

      case 'error':
        toast.error(
          `Failed to start the project: ${state.error.response?.data.message || state.error.message}`,
        );
        break;

      case 'loaded':
        onStarted();
        navigate(`/project/${project.id}/dashboard`);
        toast.success(`Project started successfully!`);
        break;

      default:
        return notReachable(state);
    }
  }, [state]);

  if (project.status !== 'analyzing') {
    return null;
  }

  return (
    <Button
      className={'mt-2 w-full'}
      loading={state.type === 'loading'}
      onClick={() => load(project.id)}
    >
      Start Project
    </Button>
  );
};
