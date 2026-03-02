import { ReactNode } from 'react';

import type { AxiosError } from 'axios';

import { queryKeys } from '@/lib/queryKeys';
import { getSubscription } from '@/modules/subscriptions/api/getSubscription';
import { SubscriptionEntity } from '@/modules/subscriptions/types/entity';
import { Button } from '@/ui/button.tsx';
import { Skeleton } from '@/ui/skeleton';
import { notReachable } from '@/utils/notReachable.ts';
import { useQuery } from '@tanstack/react-query';

type Props = {
  children: (subscription: SubscriptionEntity, reload: () => void) => ReactNode;
};

export const SubscriptionLoader = ({ children }: Props): ReactNode => {
  const { data, error, status, refetch } = useQuery<
    SubscriptionEntity,
    AxiosError<Error>
  >({
    queryKey: queryKeys.subscription.current(),
    queryFn: ({ signal }) => getSubscription(undefined, { signal }),
  });

  switch (status) {
    case 'pending':
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
          <p className={'pb-2'}>{error.message}</p>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      );

    case 'success':
      return <>{children(data!, () => refetch())}</>;

    default:
      return notReachable(status);
  }
};
