import { useEffect, useRef, useState } from 'react';

import { toast } from 'sonner';

import { useAuthSession } from '@/modules/auth/contexts/AuthSessionContext';
import { addStartShapingUserMessage } from '@/modules/shaping/api/addStartShapingUserMessage';
import { FinishShapingForm } from '@/modules/shaping/components/FinishShapingForm';
import { ShapingScore } from '@/modules/shaping/components/ShapingScore';
import { ShapingEntity } from '@/modules/shaping/types/entity';
import { supabase } from '@/modules/supabase/client';
import { Button } from '@/ui/button';
import { DialogDescription, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Label } from '@/ui/label';
import { Separator } from '@/ui/separator';
import { Textarea } from '@/ui/textarea';
import { notReachable } from '@/utils/notReachable';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { IconCheck } from '@tabler/icons-react';

export type Msg = { type: 'onUpdate'; shaping: ShapingEntity };

export const ShapingChatForm = ({
  shaping,
  onMsg,
}: {
  shaping: ShapingEntity;
  onMsg: (msg: Msg) => void;
}) => {
  const { session, clientId } = useAuthSession();
  const { state, load } = useLazyLoadableData(addStartShapingUserMessage);
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
        onMsg({ type: 'onUpdate', shaping: state.data });
        break;

      default:
        return notReachable(state);
    }
  }, [state]);

  if (shaping.status === 'finished') {
    return (
      <>
        <div className="container mx-auto flex flex-col items-center justify-center gap-2 px-4">
          <DialogHeader className={'mb-4 flex flex-col items-center gap-2'}>
            <DialogTitle
              className={'text-center text-3xl md:mb-[-20px] md:py-4'}
            >
              All data is here! Please sign up to see your results.
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className={'flex w-[300px] justify-center'}>
          {session ? (
            <IconCheck className={'size-20 text-green-600'} />
          ) : (
            <div className={'w-120 max-w-full rounded-md border px-6 py-2'}>
              <Auth
                view="sign_in"
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
                providers={[]}
                showLinks={true}
              />
            </div>
          )}
        </div>

        <FinishShapingForm
          shaping={shaping}
          onMsg={(msg) => {
            switch (msg.type) {
              case 'onFinish':
                break;

              default:
                return notReachable(msg.type);
            }
          }}
        />
      </>
    );
  }

  if (shaping.score >= 100) {
    return (
      <>
        <div className="container mx-auto flex flex-col items-center justify-center gap-2 px-4">
          <DialogHeader className={'mb-4 flex flex-col items-center gap-2'}>
            <DialogTitle
              className={'text-center text-3xl md:mb-[-20px] md:py-4'}
            >
              All data is here! Please sign up to see your results.
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className={'flex w-[300px] justify-center'}>
          {session ? (
            <IconCheck className={'size-20 text-green-600'} />
          ) : (
            <div className={'w-120 max-w-full rounded-md border px-6 py-2'}>
              <Auth
                view="sign_up"
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
                providers={[]}
                showLinks={true}
              />
            </div>
          )}
        </div>

        <FinishShapingForm
          shaping={shaping}
          onMsg={(msg) => {
            switch (msg.type) {
              case 'onFinish':
                break;

              default:
                return notReachable(msg.type);
            }
          }}
        />
      </>
    );
  }

  return (
    <div
      className={
        'relative flex min-h-full w-full flex-col gap-10 md:flex-row md:gap-2'
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
          'flex flex-col items-center justify-center gap-2 md:min-h-full md:basis-7/12'
        }
      >
        <div className="flex w-full flex-col gap-2 px-10">
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
            disabled={state.type === 'loading'}
            ref={textAreaRef}
            className={'w-full'}
          />

          {state.type !== 'loading' && (
            <div className={'flex flex-wrap gap-2'}>
              {lastAssistantMessage.answers.map((answer) => (
                <Button
                  variant={'outline'}
                  className={
                    'active:bg grow cursor-pointer rounded-md p-1 px-3'
                  }
                  onClick={() => {
                    setMessage(answer);
                    // load({ shapingId: shaping.id, message, clientId });
                  }}
                >
                  {answer}
                </Button>
              ))}
            </div>
          )}

          <Button
            className={'w-full'}
            onClick={() => load({ shapingId: shaping.id, message, clientId })}
            loading={state.type === 'loading'}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );

  // return (
  //   <>
  //     <ShapingScore score={shaping.score} />
  //
  //     <div className="container mx-auto flex flex-col items-center justify-center gap-2 px-4 pb-20">
  //       <DialogHeader className={'mb-4 flex flex-col items-center gap-2'}>
  //         <DialogTitle className={'text-center text-2xl'}>
  //           {lastAssistantMessage.content}
  //         </DialogTitle>
  //       </DialogHeader>
  //
  //       <div
  //         className={
  //           'flex w-full flex-col items-center justify-center gap-2 md:w-3/5'
  //         }
  //       >
  //         <Textarea
  //           id="description"
  //           placeholder="Enter your answer"
  //           value={message}
  //           onChange={(e) => setMessage(e.target.value)}
  //           rows={3}
  //           required={true}
  //           disabled={state.type === 'loading'}
  //           ref={textAreaRef}
  //           className={'w-full'}
  //         />
  //         <Button
  //           className={'w-full'}
  //           onClick={() => load({ shapingId: shaping.id, message, clientId })}
  //           loading={state.type === 'loading'}
  //         >
  //           Submit
  //         </Button>
  //       </div>
  //     </div>
  //   </>
  // );
};
