import { useEffect, useRef, useState } from 'react';

import { toast } from 'sonner';

import { ProjectEntity } from '@/modules/projects/types/entity';
import { addStartShapingUserMessage } from '@/modules/shaping/api/addStartShapingUserMessage';
import { finishShaping } from '@/modules/shaping/api/finishShaping';
import { ShapingEntity } from '@/modules/shaping/types/entity';
import { Button } from '@/ui/button';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { notReachable } from '@/utils/notReachable';
import { useMutation } from '@tanstack/react-query';

type Msg = { type: 'onUpdate'; shaping: ShapingEntity } | { type: 'onFinish' };

export const ShapingForm = ({
  shaping,
  onMsg,
}: {
  project: ProjectEntity;
  shaping: ShapingEntity;
  onMsg: (msg: Msg) => void;
}) => {
  const { status, data } = useMutation({
    mutationFn: (params: {
      shapingId: string;
      clientId: string;
      message: string;
    }) => addStartShapingUserMessage(params),
  });
  const { status: finishStatus, mutate: finishMutate } = useMutation({
    mutationFn: (shapingId: string) => finishShaping(shapingId),
  });
  const [message, setMessage] = useState<string>('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    switch (status) {
      case 'idle':
      case 'pending':
        break;

      case 'error':
        toast.error(`Failed to submit your message. Please try again.`);
        break;

      case 'success':
        setMessage('');
        onMsg({ type: 'onUpdate', shaping: data! });
        textAreaRef.current?.focus();
        break;

      default:
        return notReachable(status);
    }
  }, [status]);

  useEffect(() => {
    switch (finishStatus) {
      case 'idle':
      case 'pending':
        break;

      case 'error':
        toast.error(`Failed to finalize the shaping. Please try again.`);
        break;

      case 'success':
        onMsg({ type: 'onFinish' });
        break;

      default:
        return notReachable(finishStatus);
    }
  }, [finishStatus]);

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
          disabled={status === 'pending'}
          ref={textAreaRef}
          maxLength={4000}
        />
        {/*{errors.description && (*/}
        {/*  <p className="text-xs text-red-700">{errors.description.message}</p>*/}
        {/*)}*/}
      </div>

      <Button
        loading={status === 'pending'}
        // onClick={() => mutate({ shapingId: shaping.id, message })}
      >
        Submit
      </Button>

      <Button
        className={'bg-green-600'}
        disabled={shaping.score < 70 || status === 'pending'}
        loading={finishStatus === 'pending'}
        onClick={() => finishMutate(shaping.id)}
      >
        Finish
      </Button>
      <div className={'text-muted-foreground text-xs'}>
        Only when the score is higher than 70, this button becomes available
      </div>
    </div>
  );
};
