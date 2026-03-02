import { useEffect, useRef, useState } from 'react';

import { toast } from 'sonner';

import { useLazyMutation } from '@/lib/adapters';
import { useAuthSession } from '@/modules/auth/contexts/AuthSessionContext';
import { createStartShaping } from '@/modules/shaping/api/createStartShaping';
import { ShapingEntity } from '@/modules/shaping/types/entity';
import { Button } from '@/ui/button';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { notReachable } from '@/utils/notReachable';

export type Msg = { type: 'onFinish'; shaping: ShapingEntity };

export const ShapingPublicFormForm = ({
  // shaping,
  onMsg,
}: {
  // project: ProjectEntity;
  // shaping: ShapingEntity;
  onMsg: (msg: Msg) => void;
}) => {
  const { clientId } = useAuthSession();
  const { state, load } = useLazyMutation({ mutationFn: createStartShaping });
  const [message, setMessage] = useState<string>('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    switch (state.type) {
      case 'not_requested':
      case 'loading':
        break;

      case 'error':
        toast.error(
          `Failed to submit: ${state.error.response?.data.message || state.error.message}`,
        );
        break;

      case 'loaded':
        setMessage('');
        onMsg({ type: 'onFinish', shaping: state.data });
        textAreaRef.current?.focus();
        break;

      default:
        return notReachable(state);
    }
  }, [state]);

  // useEffect(() => {
  //   switch (finishState.type) {
  //     case 'not_requested':
  //     case 'loading':
  //       break;
  //
  //     case 'error':
  //       toast.error(`Failed to finalize the shaping. Please try again.`);
  //       break;
  //
  //     case 'loaded':
  //       onMsg({ type: 'onFinish' });
  //       break;
  //
  //     default:
  //       return notReachable(finishState);
  //   }
  // }, [finishState]);

  return (
    <div
      className={
        'flex min-h-full w-full flex-col items-center justify-center gap-2 md:gap-8 md:px-10'
      }
    >
      {/*<div className={'w-full px-10'}>*/}
      {/*  <img src={'/images/nightsky.jpeg'} className={'rounded-md'} />*/}
      {/*</div>*/}
      <div className="flex w-full grow flex-col gap-2 md:grow-0">
        <Label htmlFor="description" className={'text-2xl'}>
          Your Idea Description
        </Label>
        <p className={'text-muted-foreground mb-2 text-lg'}>
          For example, you can describe that you wanna build an app, some game,
          platform or you have a complex task and don't know how to solve it
        </p>
        <Textarea
          id="description"
          placeholder="Enter your answer"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={8}
          required={true}
          disabled={state.type === 'loading'}
          ref={textAreaRef}
          className={'w-full grow md:grow-0'}
          maxLength={4000}
        />
      </div>
      <Button
        className={'w-full'}
        onClick={() => load({ clientId, message })}
        loading={state.type === 'loading'}
      >
        Submit
      </Button>
    </div>
  );
};
