import { ReactNode, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { toast } from 'sonner';

import { useLazyMutation } from '@/lib/adapters';
import { useAuthSession } from '@/modules/auth/contexts/AuthSessionContext';
import { AnswersBlock } from '@/modules/projects/components/forms/AnswersBlock';
import { ProjectsContext } from '@/modules/projects/contexts/ProjectsContext';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { addShapingUserMessage } from '@/modules/shaping/api/addShapingUserMessage';
import { finishShaping } from '@/modules/shaping/api/finishShaping';
import { ShapingComment } from '@/modules/shaping/components/ShapingComment';
import { ShapingScore } from '@/modules/shaping/components/ShapingScore';
import { ShapingSummary } from '@/modules/shaping/components/ShapingSummary';
import { ShapingEntity } from '@/modules/shaping/types/entity';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Spinner } from '@/ui/spinner';
import { Textarea } from '@/ui/textarea';
import { notReachable } from '@/utils/notReachable.ts';

export const ProjectShapingForm = ({
  project,
  shaping,
  onUpdate,
}: {
  project: ProjectEntity;
  shaping: ShapingEntity;
  onUpdate: (shaping: ShapingEntity) => void;
}): ReactNode => {
  const navigate = useNavigate();
  const { reload } = useContext(ProjectsContext);
  const { clientId } = useAuthSession();
  const { state, load, reset } = useLazyMutation({
    mutationFn: addShapingUserMessage,
  });
  const { state: finishState, load: finish } = useLazyMutation({
    mutationFn: finishShaping,
  });
  const [message, setMessage] = useState<string>('');
  const assistantMessages = shaping.messages.filter(
    (m) => m.role === 'assistant',
  );
  const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];

  useEffect(() => {
    switch (state.type) {
      case 'not_requested':
      case 'loading':
        break;

      case 'loaded':
        onUpdate(state.data);
        setMessage('');
        reset();
        break;

      case 'error':
        toast.error(`Failed to create project: ${state.error.message}`);
        break;

      default:
        return notReachable(state);
    }
  }, [state, navigate]);

  useEffect(() => {
    switch (finishState.type) {
      case 'not_requested':
      case 'loading':
        break;

      case 'error':
        toast.error(`Failed the shaping processing. Please try again.`);
        break;

      case 'loaded':
        reload();
        navigate(`/project/${project.id}?new=true`);
        break;

      default:
        return notReachable(finishState);
    }
  }, [finishState]);

  if (finishState.type === 'loading') {
    return (
      <div className={'flex w-full flex-col gap-2 p-4 py-0'}>
        <Card className={'w-full items-center justify-center p-10'}>
          <Spinner className={'size-20'} />
        </Card>
      </div>
    );
  }

  if (shaping.score >= 100) {
    return (
      <div className={'flex w-full flex-col gap-2 p-4 py-0'}>
        <Card className={'w-full px-2 py-1'}>
          <ShapingSummary
            shaping={shaping}
            onMsg={(msg) => {
              switch (msg.type) {
                case 'onAccepted':
                  finish(shaping.id);
                  break;

                default:
                  return notReachable(msg.type);
              }
            }}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className={'flex w-full flex-col gap-2 p-4 py-0'}>
      <div className={'flex gap-4'}>
        <div
          className={'flex w-full flex-col items-center justify-center gap-2'}
        >
          <h1 className={'w-full text-2xl font-semibold text-white'}>
            New Project
          </h1>

          <ShapingScore score={shaping.score} />

          <Card className={'mt-2 w-full p-4'}>
            <div className={'w-full'}>
              <div className={'text-lg'}>
                {lastAssistantMessage.content ||
                  'Would you like to provide any additional information?'}
              </div>
            </div>
            <Textarea
              id="description"
              placeholder="Enter your answer"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              required={true}
              disabled={state.type === 'loading'}
              className={'w-full'}
              maxLength={4000}
            />

            {state.type !== 'loading' && (
              <AnswersBlock
                answers={lastAssistantMessage.answers}
                message={message}
                onChange={setMessage}
              />
            )}

            <Button
              className={'w-full'}
              onClick={() => load({ clientId, message, shapingId: shaping.id })}
              loading={state.type === 'loading'}
            >
              Submit
            </Button>
            <ShapingComment
              comment={lastAssistantMessage.comment}
              loading={state.type === 'loading'}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
