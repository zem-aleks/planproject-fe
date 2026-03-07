import { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { toast } from 'sonner';

import { useAuthSession } from '@/modules/auth/contexts/AuthSessionContext';
import { ProjectsContext } from '@/modules/projects/contexts/ProjectsContext';
import { createShaping } from '@/modules/shaping/api/createShaping';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Textarea } from '@/ui/textarea';
import { notReachable } from '@/utils/notReachable';
import { useMutation } from '@tanstack/react-query';

export const ProjectCreateForm = (): ReactNode => {
  const { reload } = useContext(ProjectsContext);
  const navigate = useNavigate();
  const { clientId } = useAuthSession();
  const { status, data, error, mutate } = useMutation({
    mutationFn: (params: { message: string; clientId: string }) =>
      createShaping(params),
  });
  const [message, setMessage] = useState<string>('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    switch (status) {
      case 'idle':
      case 'pending':
        break;

      case 'success':
        reload();
        toast.success(`Project draft created successfully!`);
        navigate(`/projects/edit/${data!.projectId}`);
        break;

      case 'error':
        toast.error(`Failed to create project: ${error!.message}`);
        break;

      default:
        return notReachable(status);
    }
  }, [status, navigate]);

  return (
    <div
      className={
        'flex w-full flex-col items-center justify-center gap-2 p-4 py-0'
      }
    >
      <h1 className={'w-full text-2xl font-semibold text-white'}>
        New Project
      </h1>
      <div className={'w-full'}></div>
      <Card className={'w-full p-4'}>
        <div className={''}>
          Provide all possible details about your project idea to help us create
          a comprehensive plan.
        </div>
        <Textarea
          id="description"
          placeholder="Enter your answer"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          required={true}
          disabled={status === 'pending'}
          ref={textAreaRef}
          className={'w-full'}
        />
        <Button
          className={'w-full'}
          onClick={() => mutate({ clientId, message })}
          loading={status === 'pending'}
        >
          Submit
        </Button>
      </Card>
    </div>
  );
};
