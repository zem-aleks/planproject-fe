import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { toast } from 'sonner';

import { useAuthSession } from '@/modules/auth/contexts/AuthSessionContext';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { connectProject } from '@/modules/shaping/api/connectProject';
import { Button } from '@/ui/button';
import { Spinner } from '@/ui/spinner';
import { notReachable } from '@/utils/notReachable';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData';

export const ConnectProjectForm = ({ project }: { project: ProjectEntity }) => {
  const navigate = useNavigate();
  const { session, clientId } = useAuthSession();
  const { state, load } = useLazyLoadableData(connectProject);

  useEffect(() => {
    switch (state.type) {
      case 'not_requested':
      case 'loading':
        break;

      case 'error':
        toast.error(`Failed the shaping processing. Please try again.`);
        break;

      case 'loaded':
        navigate(`/project/${project.id}?new=true`);
        break;

      default:
        return notReachable(state);
    }
  }, [state]);

  useEffect(() => {
    if (session && state.type === 'not_requested') {
      load({ projectId: project.id, clientId: clientId });
    }
  }, [session, state, project.id, clientId, load]);

  switch (state.type) {
    case 'not_requested':
      return (
        <div
          className={
            'flex items-center justify-center text-center text-sm italic md:text-lg'
          }
        >
          Your project is waiting for you...
        </div>
      );

    case 'loading':
      return (
        <div
          className={
            'flex items-center justify-center gap-2 text-center text-lg'
          }
        >
          <Spinner /> Connecting your account with the project...
        </div>
      );

    case 'loaded':
      return (
        <div
          className={
            'flex items-center justify-center gap-2 text-center text-lg'
          }
        >
          <Spinner /> Opening your dashboard...
        </div>
      );

    case 'error':
      return (
        <div
          className={
            'flex flex-col items-center justify-center text-center text-lg'
          }
        >
          Something went wrong
          <Button
            className={'mt-4'}
            onClick={() => load({ projectId: project.id, clientId: clientId })}
          >
            Try again
          </Button>
        </div>
      );

    default:
      return notReachable(state);
  }
};
