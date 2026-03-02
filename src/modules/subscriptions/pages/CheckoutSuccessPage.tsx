import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import type { AxiosError } from 'axios';
import { LoaderCircle } from 'lucide-react';

import { queryKeys } from '@/lib/queryKeys';
import { getUser } from '@/modules/auth/api/getUser';
import { useUser } from '@/modules/auth/contexts/UserContext';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';
import { UserEntity } from '@/modules/users/types/user';
import { Card } from '@/ui/card';
import { useQuery } from '@tanstack/react-query';

export const CheckoutSuccessPage = () => {
  const { reload } = useUser();
  const [polling, setPolling] = useState(true);
  const { data, status } = useQuery<UserEntity, AxiosError<Error>>({
    queryKey: [...queryKeys.user.current(), 'checkout-poll'],
    queryFn: ({ signal }) => getUser(undefined, { signal }),
    refetchInterval: polling ? 3000 : false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'success' && data!.subscription !== 'basic') {
      setPolling(false);
      reload();
      navigate('/projects');
    }
  }, [status, data]); // eslint-disable-line react-hooks/exhaustive-deps

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
