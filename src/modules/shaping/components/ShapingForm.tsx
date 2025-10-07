import { useEffect, useRef, useState } from 'react';

import { toast } from 'sonner';

import { ProjectEntity } from '@/modules/projects/types/entity';
import { addShapingUserMessage } from '@/modules/shaping/api/addShapingUserMessage';
import { finishShaping } from '@/modules/shaping/api/finishShaping';
import { ShapingEntity } from '@/modules/shaping/types/entity';
import { Button } from '@/ui/button';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { notReachable } from '@/utils/notReachable';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData';

type Msg = { type: 'onUpdate'; shaping: ShapingEntity } | { type: 'onFinish' };

export const ShapingForm = ({
  shaping,
  onMsg,
}: {
  project: ProjectEntity;
  shaping: ShapingEntity;
  onMsg: (msg: Msg) => void;
}) => {
  const { state } = useLazyLoadableData(addShapingUserMessage);
  const { state: finishState, load: finishLoad } =
    useLazyLoadableData(finishShaping);
  const [message, setMessage] = useState<string>('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    switch (state.type) {
      case 'not_requested':
      case 'loading':
        break;

      case 'error':
        toast.error(`Failed to submit your message. Please try again.`);
        break;

      case 'loaded':
        setMessage('');
        onMsg({ type: 'onUpdate', shaping: state.data });
        textAreaRef.current?.focus();
        break;

      default:
        return notReachable(state);
    }
  }, [state]);

  useEffect(() => {
    switch (finishState.type) {
      case 'not_requested':
      case 'loading':
        break;

      case 'error':
        toast.error(`Failed to finalize the shaping. Please try again.`);
        break;

      case 'loaded':
        onMsg({ type: 'onFinish' });
        break;

      default:
        return notReachable(finishState);
    }
  }, [finishState]);

  return (
    <div className="flex flex-col gap-2">
      <div className={'text-xl font-semibold'}>
        Shaping Score: {shaping.score}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Provide all available details</Label>
        <p className={'text-muted-foreground text-xs'}>
          Let's start te project shaping. Please describe your idea, available
          resources and what would you like to achieve
        </p>

        {shaping.messages.map((message) => (
          <div
            className={`rounded-md border p-2 ${message.role === 'assistant' ? 'bg-green-600' : 'bg-blue-200'}`}
            key={message.id}
          >
            [{message.role}] {message.content}
          </div>
        ))}

        <Textarea
          id="description"
          placeholder="Enter your answer"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required={true}
          disabled={state.type === 'loading'}
          ref={textAreaRef}
        />
        {/*{errors.description && (*/}
        {/*  <p className="text-xs text-red-700">{errors.description.message}</p>*/}
        {/*)}*/}
      </div>

      <Button
        loading={state.type === 'loading'}
        // onClick={() => load({ shapingId: shaping.id, message })}
      >
        Submit
      </Button>

      <Button
        className={'bg-green-600'}
        disabled={shaping.score < 70 || state.type === 'loading'}
        loading={finishState.type === 'loading'}
        onClick={() => finishLoad(shaping.id)}
      >
        Finish
      </Button>
      <div className={'text-muted-foreground text-xs'}>
        Only when the score is higher than 70, this button becomes available
      </div>
    </div>
  );
};
