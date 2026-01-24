import { useEffect } from 'react';

import { toast } from 'sonner';

import { useAuthSession } from '@/modules/auth/contexts/AuthSessionContext';
import { ProjectLogoBuilder } from '@/modules/projects/components/ProjectLogoBuilder';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { finishStartShaping } from '@/modules/shaping/api/finishStartShaping';
import { ConnectProjectForm } from '@/modules/shaping/components/ConnectProjectForm';
import { ShapingEntity } from '@/modules/shaping/types/entity';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Skeleton } from '@/ui/skeleton';
import { notReachable } from '@/utils/notReachable';
import { useLoadableData } from '@/utils/useLoadableData';

type Msg = { type: 'onFinish'; project: ProjectEntity };

export const FinishPublicShapingForm = ({
  shaping,
  onMsg,
}: {
  shaping: ShapingEntity;
  onMsg: (msg: Msg) => void;
}) => {
  const { clientId } = useAuthSession();
  const { state, reload } = useLoadableData(finishStartShaping, {
    shapingId: shaping.id,
    clientId: clientId,
  });

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

  if (shaping.status === 'processing') {
    return null;
  }

  switch (state.type) {
    case 'loading':
      return (
        <Card className={'mt-4 flex w-[520px] flex-col gap-2 p-4 px-4'}>
          <Skeleton className={'mb-1 h-5 w-full'} />
          <Skeleton className={'h-4 w-full'} />
          <Skeleton className={'h-4 w-full'} />
          <Skeleton className={'h-4 w-[70%]'} />
        </Card>
      );

    case 'loaded':
      return (
        <div>
          <ConnectProjectForm project={state.data} />
          <div className={'relative mt-2 overflow-hidden rounded-lg p-[2px]'}>
            <div className="absolute inset-0 animate-[gradient_4s_linear_infinite] bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-[length:200%_200%]" />
            <Card
              className={
                'relative flex w-full max-w-[520px] flex-row gap-4 overflow-hidden rounded-lg p-4'
              }
            >
              <ProjectLogoBuilder project={state.data} />
              <div className={'flex-col gap-0'}>
                <div className={'text-xl font-semibold'}>
                  {state.data.title}
                </div>
                <div className={'text-muted-foreground'}>
                  {state.data.description}
                </div>
                {state.data.daysNeeded && (
                  <Badge>
                    Initial estimation: {state.data.daysNeeded} days
                  </Badge>
                )}
              </div>
            </Card>
          </div>
        </div>
      );

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
