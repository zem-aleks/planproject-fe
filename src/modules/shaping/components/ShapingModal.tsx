import { AxiosError } from 'axios';
import { Lightbulb } from 'lucide-react';

import { useAuthSession } from '@/modules/auth/contexts/AuthSessionContext';
import { getStartShaping } from '@/modules/shaping/api/getStartShaping';
import { ShapingChatForm } from '@/modules/shaping/components/ShapingChatForm';
import {
  ShapingPublicFormForm,
  Msg as ShapingPublicFormFormMsg,
} from '@/modules/shaping/components/ShapingCreationForm';
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import { Spinner } from '@/ui/spinner';
import { notReachable } from '@/utils/notReachable';
import { useReloadableData } from '@/utils/useReloadableData';

type Msg = { type: 'onClose' };

export const ShapingModal = ({
  open,
  onMsg,
}: {
  open: boolean;
  onMsg: (msg: Msg) => void;
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => !open && onMsg({ type: 'onClose' })}
      modal={true}
    >
      <DialogContent className="flex h-full max-h-full w-full max-w-full flex-col items-center justify-center gap-4 rounded-none p-0 sm:max-w-full md:h-[90%] md:w-[94%] md:max-w-[94%] md:rounded-md lg:h-[700px] lg:max-w-[1200px]">
        <ShapingContent />
      </DialogContent>
    </Dialog>
  );
};

const ShapingContent = () => {
  const { clientId } = useAuthSession();
  const { state, reload, setData } = useReloadableData(
    getStartShaping,
    clientId,
  );

  switch (state.type) {
    case 'loading':
      return <LoadingContent />;

    case 'loaded':
    case 'reloading':
      if (!state.data) {
        return (
          <ShapingContentInitialForm
            onMsg={(msg) => {
              switch (msg.type) {
                case 'onFinish':
                  setData(msg.shaping);
                  break;

                default:
                  return notReachable(msg.type);
              }
            }}
          />
        );
      }

      return (
        <ShapingChatForm
          shaping={state.data}
          onMsg={(msg) => {
            switch (msg.type) {
              case 'onUpdate':
                setData(msg.shaping);
                break;

              default:
                return notReachable(msg.type);
            }
          }}
        />
      );

    case 'error':
      return <ErrorContent error={state.error} onRetry={reload} />;

    default:
      return notReachable(state);
  }
};

const LoadingContent = () => {
  return (
    <>
      <Spinner className={'size-40'} />
      <div className="container mx-auto px-4 pb-20">
        <DialogHeader className={'mb-4 flex flex-col items-center gap-2'}>
          <DialogTitle className={'text-center text-2xl'}>
            Loading...
          </DialogTitle>
          <DialogDescription className={'w-full text-center text-xl md:w-1/2'}>
            Please wait while we preparing everything for you.
          </DialogDescription>
        </DialogHeader>
      </div>
    </>
  );
};

const ErrorContent = ({
  error,
  onRetry,
}: {
  error: AxiosError<{ message: string }>;
  onRetry: () => void;
}) => {
  return (
    <div className="container mx-auto px-4 pb-20">
      <DialogHeader className={'mb-4 flex flex-col items-center gap-2'}>
        <DialogTitle className={'text-center text-2xl'}>
          Something went wrong
        </DialogTitle>
        <DialogDescription className={'w-full text-center text-xl md:w-1/2'}>
          {error.response?.data?.message || error.message || 'Unknown error'}
        </DialogDescription>
        <Button onClick={onRetry}>Try again</Button>
      </DialogHeader>
    </div>
  );
};

const ShapingContentInitialForm = ({
  onMsg,
}: {
  onMsg: (msg: ShapingPublicFormFormMsg) => void;
}) => {
  return (
    <div
      className={'relative flex min-h-full w-full flex-col gap-2 md:flex-row'}
    >
      <DialogHeader
        className={
          'relative flex-col items-center justify-center gap-3 overflow-hidden rounded-l-md bg-[#803698] p-4 md:flex md:h-full md:basis-5/12 md:items-start md:p-10 md:pr-4'
        }
      >
        <DialogTitle
          className={'flex gap-1 text-2xl text-gray-200 md:text-4xl'}
        >
          <span>Describe Your Idea</span>
          <Lightbulb className={'size-10 text-gray-200'} />
        </DialogTitle>
        <DialogDescription
          className={'w-full text-lg text-gray-200 md:text-2xl'}
        >
          Provide all possible details about your project idea to help us create
          a comprehensive plan. Add all information that can be related to your
          idea and it's development.
        </DialogDescription>
      </DialogHeader>

      <div
        className={'flex grow flex-col items-center gap-2 p-4 md:basis-7/12'}
      >
        <ShapingPublicFormForm onMsg={onMsg} />
      </div>
    </div>
  );
};
