import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { LoaderCircle } from 'lucide-react';

import { usePollingQuery } from '@/lib/adapters';
import { queryKeys } from '@/lib/queryKeys';
import { getUser } from '@/modules/auth/api/getUser';
import { useUser } from '@/modules/auth/contexts/UserContext';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';
import { UserEntity } from '@/modules/users/types/user';
import { Card } from '@/ui/card';

export const CheckoutSuccessPage = () => {
  const { reload } = useUser();
  const { state, stopPolling } = usePollingQuery<UserEntity>({
    queryKey: [...queryKeys.user.current(), 'checkout-poll'],
    queryFn: ({ signal }) => getUser(undefined, { signal }),
    interval: 3000,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (state.type === 'loaded' || state.type === 'reloading') {
      if (state.data.subscription !== 'basic') {
        stopPolling();
        reload();
        navigate('/projects');
      }
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PageTemplate
      header={{
        breadcrumbs: [{ title: 'Account', href: '/account' }],
        title: `Account`,
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className={'flex flex-row gap-8'}>
          <div className="flex grow flex-col gap-0">
            <h1
              className={
                'flex items-center justify-between gap-2 text-2xl font-semibold text-white'
              }
            >
              You successfully finished your subscription
            </h1>
            <div className={'text-gray-200'}>
              Please wait a bit, we're syncing you subscription info
            </div>
          </div>
        </div>

        <Card className={'items-center justify-center gap-4 p-4'}>
          <div className={'text-xl font-semibold'}>
            Updating your subscription...
          </div>
          <LoaderCircle className={'size-20 animate-spin'} />
        </Card>
      </div>
    </PageTemplate>
  );
};
