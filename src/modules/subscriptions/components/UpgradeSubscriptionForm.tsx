import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { createCheckoutSession } from '@/modules/subscriptions/api/createCheckoutSession';
import {
  SubscriptionPeriod,
  SubscriptionType,
} from '@/modules/users/types/user';
import { Button } from '@/ui/button';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData';

export const UpgradeSubscriptionForm = (data: {
  type: SubscriptionType;
  period: SubscriptionPeriod;
}) => {
  const { state, load } = useLazyLoadableData(createCheckoutSession);
  const navigate = useNavigate();

  useEffect(() => {
    if (state.type === 'loaded') {
      window.location.href = state.data.url;
    }
  }, [state, navigate]);

  return (
    <Button
      className={'w-full'}
      variant={'warning'}
      onClick={() => load(data)}
      loading={state.type === 'loading'}
    >
      Upgrade
    </Button>
  );
};
