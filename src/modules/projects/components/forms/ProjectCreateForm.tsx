import { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { toast } from 'sonner';

import { useLazyMutation } from '@/lib/adapters';
import { useAuthSession } from '@/modules/auth/contexts/AuthSessionContext';
import { ProjectsContext } from '@/modules/projects/contexts/ProjectsContext';
import { createShaping } from '@/modules/shaping/api/createShaping';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Textarea } from '@/ui/textarea';
import { notReachable } from '@/utils/notReachable';

export const ProjectCreateForm = (): ReactNode => {
  const { reload } = useContext(ProjectsContext);
  const navigate = useNavigate();
  const { clientId } = useAuthSession();
  const { state, load } = useLazyMutation({ mutationFn: createShaping });
  const [message, setMessage] = useState<string>('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    switch (state.type) {
      case 'not_requested':
      case 'loading':
        break;

      case 'loaded':
        reload();
        toast.success(`Project draft created successfully!`);
        navigate(`/projects/edit/${state.data.projectId}`);
        break;

      case 'error':
        toast.error(`Failed to create project: ${state.error.message}`);
        break;

      default:
        return notReachable(state);
    }
  }, [state, navigate]);

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
          disabled={state.type === 'loading'}
          ref={textAreaRef}
          className={'w-full'}
        />
        <Button
          className={'w-full'}
          onClick={() => load({ clientId, message })}
          loading={state.type === 'loading'}
        >
          Submit
        </Button>
      </Card>
    </div>
  );
};
