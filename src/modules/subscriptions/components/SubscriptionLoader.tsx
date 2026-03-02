import { ReactNode } from 'react';

import { useLoadableQuery } from '@/lib/adapters';
import { queryKeys } from '@/lib/queryKeys';
import { getSubscription } from '@/modules/subscriptions/api/getSubscription';
import { SubscriptionEntity } from '@/modules/subscriptions/types/entity';
import { Button } from '@/ui/button.tsx';
import { Skeleton } from '@/ui/skeleton';
import { notReachable } from '@/utils/notReachable.ts';

type Props = {
  children: (subscription: SubscriptionEntity, reload: () => void) => ReactNode;
};

export const SubscriptionLoader = ({ children }: Props): ReactNode => {
  const { state, reload } = useLoadableQuery<SubscriptionEntity>({
    queryKey: queryKeys.subscription.current(),
    queryFn: ({ signal }) => getSubscription(undefined, { signal }),
  });

  switch (state.type) {
    case 'loading':
      return (
        <div className={'flex flex-col gap-2'}>
          <Skeleton className={'h-12 w-full'} />
          <Skeleton className={'h-8 w-full'} />
        </div>
      );

    case 'error':
      return (
        <div className={'flex flex-col gap-2'}>
          <p className={'text-xl text-red-700'}>
            Subscription Data loading error
          </p>
          <p className={'pb-2'}>{state.error.message}</p>
          <Button onClick={reload}>Try again</Button>
        </div>
      );

    // case 'reloading':
    case 'loaded':
      return <>{children(state.data, reload)}</>;

    default:
      return notReachable(state);
  }
};
