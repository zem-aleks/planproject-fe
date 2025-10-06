import { AxiosError } from 'axios';

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
      <DialogContent className="flex h-full max-w-full flex-col items-center justify-center gap-4 rounded-none sm:h-full sm:max-w-full">
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
    <>
      <div
        className={
          'flex size-48 flex-col items-center justify-center rounded-full border-3 border-green-700 bg-green-100 text-center text-2xl'
        }
      >
        <p>0 / 100</p>
        <p>points</p>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <DialogHeader className={'mb-4 flex flex-col items-center gap-2'}>
          <DialogTitle className={'text-center text-2xl'}>
            Describe Your Idea
          </DialogTitle>
          <DialogDescription className={'w-full text-center text-xl md:w-1/2'}>
            Provide all possible details about your project idea to help us
            create a comprehensive plan.
          </DialogDescription>
        </DialogHeader>
        <ShapingPublicFormForm onMsg={onMsg} />
      </div>
    </>
  );
};
