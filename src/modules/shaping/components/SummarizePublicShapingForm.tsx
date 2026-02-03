import { useEffect } from 'react';

import { toast } from 'sonner';

import { useAuthSession } from '@/modules/auth/contexts/AuthSessionContext';
import { summarizeShaping } from '@/modules/shaping/api/summarizeShaping';
import { ShapingEntity } from '@/modules/shaping/types/entity';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Skeleton } from '@/ui/skeleton';
import { notReachable } from '@/utils/notReachable';
import { useLoadableData } from '@/utils/useLoadableData';

type Msg = { type: 'onFinish'; shaping: ShapingEntity };

export const SummarizePublicShapingForm = ({
  shaping,
  onMsg,
}: {
  shaping: ShapingEntity;
  onMsg: (msg: Msg) => void;
}) => {
  const { clientId } = useAuthSession();
  const { state, reload } = useLoadableData(summarizeShaping, {
    shapingId: shaping.id,
    clientId: clientId,
  });

  useEffect(() => {
    switch (state.type) {
      case 'loading':
        break;

      case 'error':
        toast.error(`Failed the summarizing processing. Please try again.`);
        break;

      case 'loaded':
        onMsg({ type: 'onFinish', shaping: state.data });
        break;

      default:
        return notReachable(state);
    }
  }, [state]);

  switch (state.type) {
    case 'loaded':
    case 'loading':
      return (
        <div
          className={
            'relative flex min-h-full w-full flex-col gap-2 p-4 md:gap-4'
          }
        >
          <div className={'py-2 text-lg font-semibold md:text-3xl'}>
            Please review the summary
          </div>
          <Card className={'grow overflow-y-auto bg-gray-50 p-4'}>
            <div className={'flex flex-col gap-2'}>
              <Skeleton className={'mb-2 h-10 w-full'} />
              <Skeleton className={'h-6 w-full'} />
              <Skeleton className={'h-6 w-full'} />
              <Skeleton className={'h-6 w-full'} />
              <Skeleton className={'h-6 w-full'} />
              <Skeleton className={'h-6 w-2/3'} />
            </div>
          </Card>
          <div className={'flex w-full flex-wrap justify-end gap-4'}>
            <Button
              className={'w-full bg-green-600 px-12 md:w-auto'}
              loading={true}
            >
              Loading...
            </Button>
          </div>
        </div>
      );

    case 'error':
      return (
        <Card className={'mt-4 flex w-[520px] flex-col gap-2 p-4 px-4'}>
          <div className={'text-xl font-semibold text-red-700'}>
            Something went wrong
          </div>
          <div className={'text-red-700'}>{state.error.message}</div>
          <Button className={'mt-4'} onClick={reload}>
            Try again
          </Button>
        </Card>
      );

    default:
      return notReachable(state);
  }
};
