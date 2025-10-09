import { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { toast } from 'sonner';

import { useAuthSession } from '@/modules/auth/contexts/AuthSessionContext';
import { ProjectsContext } from '@/modules/projects/contexts/ProjectsContext';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { addShapingUserMessage } from '@/modules/shaping/api/addShapingUserMessage';
import { FinishShapingButton } from '@/modules/shaping/components/FinishShapingButton';
import { ShapingComment } from '@/modules/shaping/components/ShapingComment';
import { ShapingScore } from '@/modules/shaping/components/ShapingScore';
import { ShapingEntity } from '@/modules/shaping/types/entity';
import { Button } from '@/ui/button';
import { Textarea } from '@/ui/textarea';
import { notReachable } from '@/utils/notReachable.ts';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData.ts';

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
  const { state, load, reset } = useLazyLoadableData(addShapingUserMessage);
  const [message, setMessage] = useState<string>('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
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

  return (
    <div className={'flex w-full flex-col gap-2 p-4 py-0'}>
      <div className={'flex gap-4'}>
        <div
          className={'flex w-full flex-col items-center justify-center gap-2'}
        >
          <h1 className={'w-full text-2xl font-semibold'}>New Project</h1>
          <div className={'w-full'}>
            <div className={'text-lg'}>{lastAssistantMessage.content}</div>
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
            onClick={() => load({ clientId, message, shapingId: shaping.id })}
            loading={state.type === 'loading'}
          >
            Submit
          </Button>
          <ShapingComment
            comment={lastAssistantMessage.comment}
            loading={state.type === 'loading'}
          />
        </div>

        <ShapingScore score={shaping.score} />
      </div>

      <FinishShapingButton
        shaping={shaping}
        onFinish={() => {
          reload();
          navigate(`/project/${project.id}`);
        }}
      />
    </div>
  );
};
