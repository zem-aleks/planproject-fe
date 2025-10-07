import { useEffect } from 'react';

import { toast } from 'sonner';

import { ProjectEntity } from '@/modules/projects/types/entity';
import { finishShaping } from '@/modules/shaping/api/finishShaping';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Skeleton } from '@/ui/skeleton';
import { notReachable } from '@/utils/notReachable';
import { useLoadableData } from '@/utils/useLoadableData';
import { IconCheck } from '@tabler/icons-react';

type Msg = { type: 'onFinish'; project: ProjectEntity };

export const FinishShapingFormInternal = ({
  shapingId,
  onMsg,
}: {
  shapingId: string;
  onMsg: (msg: Msg) => void;
}) => {
  const { state, reload } = useLoadableData(finishShaping, shapingId);

  useEffect(() => {
    switch (state.type) {
      case 'loading':
        break;

      case 'error':
        toast.error(`Failed the shaping processing. Please try again.`);
        break;

      case 'loaded':
        onMsg({ type: 'onFinish', project: state.data });
        break;

      default:
        return notReachable(state);
    }
  }, [state]);

  switch (state.type) {
    case 'loading':
      return <Skeleton className={'h-40 w-full'} />;

    case 'loaded':
      return <IconCheck className={'size-20 text-green-600'} />;

    case 'error':
      return (
        <Card className={'mt-4 flex w-[520px] flex-col gap-2 p-4 px-4'}>
          <div className={'text-xl font-semibold'}>Something went wrong</div>
          <Button className={'mt-4'} onClick={reload}>
            Try again
          </Button>
        </Card>
      );

    default:
      return notReachable(state);
  }
};
