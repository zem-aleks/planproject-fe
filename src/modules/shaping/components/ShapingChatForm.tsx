import { ReactNode, useEffect, useRef, useState } from 'react';

import type { AxiosError } from 'axios';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

import { useAuthSession } from '@/modules/auth/contexts/AuthSessionContext';
import { AnswersBlock } from '@/modules/projects/components/forms/AnswersBlock';
import { addStartShapingUserMessage } from '@/modules/shaping/api/addStartShapingUserMessage';
import { FinishPublicShapingForm } from '@/modules/shaping/components/FinishPublicShapingForm';
import { ShapingScore } from '@/modules/shaping/components/ShapingScore';
import { ShapingEntity } from '@/modules/shaping/types/entity';
import { supabase } from '@/modules/supabase/client';
import { Button } from '@/ui/button';
import { DialogDescription, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Label } from '@/ui/label';
import { Separator } from '@/ui/separator';
import { Textarea } from '@/ui/textarea';
import { noOperation, notReachable } from '@/utils/notReachable';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useMutation } from '@tanstack/react-query';

export type Msg = { type: 'onUpdate'; shaping: ShapingEntity };

export const ShapingChatForm = ({
  shaping,
  onMsg,
}: {
  shaping: ShapingEntity;
  onMsg: (msg: Msg) => void;
}) => {
  // const [confirmed, setConfirmed] = useState<boolean>(false);
  const { session, clientId } = useAuthSession();
  const { status, data, error, mutate } = useMutation<
    ShapingEntity,
    AxiosError<{ message: string }>,
    { shapingId: string; clientId: string; message: string }
  >({
    mutationFn: (params) => addStartShapingUserMessage(params),
  });
  const [message, setMessage] = useState<string>('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const assistantMessages = shaping.messages.filter(
    (m) => m.role === 'assistant',
  );
  const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  useEffect(() => {
    switch (status) {
      case 'idle':
      case 'pending':
        break;

      case 'error':
        toast.error(
          `Failed to submit: ${error!.response?.data.message || error!.message}`,
        );
        break;

      case 'success':
        setMessage('');
        onMsg({ type: 'onUpdate', shaping: data! });
        break;

      default:
        return notReachable(status);
    }
  }, [status]);

  if (shaping.score >= 100) {
    return (
      <FinishModal
        title={`All data is here! Please sign up to see your results`}
      >
        <SignCard
          signedIn={!!session}
          view={shaping.status === 'finished' ? 'sign_in' : 'sign_up'}
        />
        <FinishPublicShapingForm shaping={shaping} onMsg={noOperation} />
      </FinishModal>
    );
  }

  // if (shaping.score >= 100) {
  //   return (
  //     <ShapingSummary
  //       shaping={shaping}
  //       onMsg={(msg) => {
  //         switch (msg.type) {
  //           case 'onAccepted':
  //             setConfirmed(true);
  //             break;
  //
  //           default:
  //             return notReachable(msg.type);
  //         }
  //       }}
  //     />
  //   );
  // }

  return (
    <div
      className={
        'relative flex min-h-full w-full flex-col md:flex-row md:gap-2'
      }
    >
      <DialogHeader
        className={
          'relative flex-col items-center justify-center gap-3 overflow-hidden bg-[#803698] p-4 md:flex md:h-full md:basis-5/12 md:rounded-l-md md:p-10'
        }
      >
        <ShapingScore score={shaping.score} />
        <Separator />
        <DialogDescription
          className={'w-full text-lg text-gray-200 md:text-center md:text-2xl'}
        >
          {lastAssistantMessage.comment}
        </DialogDescription>
      </DialogHeader>

      <div
        className={
          'flex grow flex-col items-center justify-center gap-2 md:min-h-full md:basis-7/12'
        }
      >
        <div className="flex w-full grow flex-col gap-2 p-4 md:grow-0">
          <Label htmlFor="description" className={'text-2xl'}>
            {lastAssistantMessage.content}
          </Label>
          <Textarea
            id="description"
            placeholder="Enter your answer"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
            required={true}
            disabled={status === 'pending'}
            ref={textAreaRef}
            className={'w-full grow md:grow-0'}
            maxLength={4000}
          />

          {status !== 'pending' && (
            <AnswersBlock
              answers={lastAssistantMessage.answers}
              message={message}
              onChange={setMessage}
            />
          )}

          <Button
            className={'w-full'}
            onClick={() => mutate({ shapingId: shaping.id, message, clientId })}
            loading={status === 'pending'}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

const FinishModal = ({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) => {
  return (
    <div className={'container overflow-y-auto'}>
      <div className="mx-auto flex flex-col items-center justify-center gap-2 px-4">
        <DialogHeader className={'my-4 flex flex-col items-center gap-2'}>
          <DialogTitle
            className={
              'pr-12 text-left text-xl md:mb-[-20px] md:py-4 md:pr-0 md:text-center md:text-3xl'
            }
          >
            {title}
          </DialogTitle>
        </DialogHeader>
      </div>

      <div
        className={
          'flex flex-col items-center justify-center gap-4 p-4 pt-0 md:flex-row md:gap-8'
        }
      >
        {children}
      </div>
    </div>
  );
};

const SignCard = ({
  signedIn,
  view,
}: {
  signedIn: boolean;
  view: 'sign_in' | 'sign_up';
}) => {
  if (signedIn) {
    return (
      <div
        className={
          'flex w-full max-w-full flex-col items-center justify-center rounded-md border px-6 py-2 md:w-[340px]'
        }
      >
        <div className={'py-2 text-center text-lg font-semibold'}>
          You're signed in
        </div>
        <LoaderCircle className={'mb-4 size-14 animate-spin'} />
      </div>
    );
  }

  return (
    <div
      className={
        'flex w-full max-w-full flex-col justify-center rounded-md border px-6 py-2 md:w-[340px]'
      }
    >
      <div className={'py-2 text-center text-lg font-semibold'}>
        Enter your credentials
      </div>
      <Auth
        view={view}
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,

          style: {
            button: {
              borderRadius: '5px',
              borderColor: 'rgba(0,0,0,0.2)',
            },
          },
          variables: {
            default: {
              colors: {
                brand: '#000',
                brandAccent: '#cfd1ff',
              },
            },
          },
        }}
        providers={['google']}
        showLinks={true}
        redirectTo={`${window.location.origin}/auth/callback`}
      />
    </div>
  );
};
