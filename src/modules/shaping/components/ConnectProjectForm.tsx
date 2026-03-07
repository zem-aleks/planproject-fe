import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { toast } from 'sonner';

import { useAuthSession } from '@/modules/auth/contexts/AuthSessionContext';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { connectProject } from '@/modules/shaping/api/connectProject';
import { Button } from '@/ui/button';
import { Spinner } from '@/ui/spinner';
import { notReachable } from '@/utils/notReachable';
import { useMutation } from '@tanstack/react-query';

export const ConnectProjectForm = ({ project }: { project: ProjectEntity }) => {
  const navigate = useNavigate();
  const { session, clientId } = useAuthSession();
  const { status, mutate } = useMutation({
    mutationFn: (params: { projectId: string; clientId: string }) =>
      connectProject(params),
  });

  useEffect(() => {
    switch (status) {
      case 'idle':
      case 'pending':
        break;

      case 'error':
        toast.error(`Failed the shaping processing. Please try again.`);
        break;

      case 'success':
        navigate(`/project/${project.id}?new=true`);
        break;

      default:
        return notReachable(status);
    }
  }, [status]);

  useEffect(() => {
    if (session && status === 'idle') {
      mutate({ projectId: project.id, clientId: clientId });
    }
  }, [session, status, project.id, clientId, mutate]);

  switch (status) {
    case 'idle':
      return (
        <div
          className={
            'flex items-center justify-center text-center text-sm italic md:text-lg'
          }
        >
          Your project is waiting for you...
        </div>
      );

    case 'pending':
      return (
        <div
          className={
            'flex items-center justify-center gap-2 text-center text-lg'
          }
        >
          <Spinner /> Connecting your account with the project...
        </div>
      );

    case 'success':
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
            onClick={() =>
              mutate({ projectId: project.id, clientId: clientId })
            }
          >
            Try again
          </Button>
        </div>
      );

    default:
      return notReachable(status);
  }
};
