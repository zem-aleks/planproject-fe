import { useEffect, useRef, useState } from 'react';

import { toast } from 'sonner';

import { useAuthSession } from '@/modules/auth/contexts/AuthSessionContext';
import { addShapingUserMessage } from '@/modules/shaping/api/addShapingUserMessage';
import { FinishShapingForm } from '@/modules/shaping/components/FinishShapingForm';
import { ShapingEntity } from '@/modules/shaping/types/entity';
import { supabase } from '@/modules/supabase/client';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { DialogHeader, DialogTitle } from '@/ui/dialog';
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
  const { state, load } = useLazyLoadableData(addShapingUserMessage);
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

        <div className="container mx-auto mt-4 flex flex-col items-center justify-center gap-2 px-4">
          <DialogHeader className={'flex flex-col items-center gap-2'}>
            <DialogTitle className={'text-center text-2xl'}>
              Please sign in to continue
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className={'flex w-[300px] justify-center'}>
          {session ? (
            <IconCheck className={'size-20 text-green-600'} />
          ) : (
            <div className={'w-full'}>
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
      </>
    );
  }

  if (shaping.score >= 100) {
    return (
      <>
        <div
          className={
            'flex size-48 flex-col items-center justify-center rounded-full border-3 border-green-700 bg-green-100 text-center text-2xl'
          }
        >
          <p>{shaping.score} / 100</p>
          <p>points</p>
        </div>

        <div className="container mx-auto flex flex-col items-center justify-center gap-2 px-4">
          <DialogHeader className={'mb-4 flex flex-col items-center gap-2'}>
            <DialogTitle className={'text-center text-2xl'}>
              All data is here! Please sign up to see your results.
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className={'flex w-[300px] justify-center'}>
          {session ? (
            <IconCheck className={'size-20 text-green-600'} />
          ) : (
            <div className={'w-full'}>
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
    <>
      <div
        className={
          'flex size-48 flex-col items-center justify-center rounded-full border-3 border-green-700 bg-green-100 text-center text-2xl'
        }
      >
        <p>{shaping.score} / 100</p>
        <p>points</p>
      </div>

      <div className="container mx-auto flex flex-col items-center justify-center gap-2 px-4 pb-20">
        <DialogHeader className={'mb-4 flex flex-col items-center gap-2'}>
          <DialogTitle className={'text-center text-2xl'}>
            {lastAssistantMessage.content}
          </DialogTitle>
        </DialogHeader>

        <div
          className={
            'flex w-full flex-col items-center justify-center gap-2 md:w-3/5'
          }
        >
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
            onClick={() => load({ shapingId: shaping.id, message, clientId })}
            loading={state.type === 'loading'}
          >
            Submit
          </Button>

          <div className={'flex w-full items-start gap-2 text-xl'}>
            <img
              src={
                'https://akmoolaxrpskmtqdymjo.supabase.co/storage/v1/object/public/assets/fox.png'
              }
              alt={'Funny fox'}
              className={'animate-in fade-in-0 h-24'}
            />
            <Badge
              variant={'outline'}
              className={
                'shrink px-4 py-2 text-sm whitespace-normal sm:text-lg'
              }
            >
              {state.type === 'loading' ? (
                <>
                  <b className={'animate-bounce'}>.</b>
                  <b className={'animate-bounce delay-100'}>.</b>
                  <b className={'animate-bounce delay-300'}>.</b>
                </>
              ) : (
                lastAssistantMessage.comment
              )}
            </Badge>
          </div>
        </div>
      </div>
    </>
  );
};
