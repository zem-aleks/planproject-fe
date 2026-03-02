import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { createCheckoutSession } from '@/modules/subscriptions/api/createCheckoutSession';
import {
  SubscriptionPeriod,
  SubscriptionType,
} from '@/modules/users/types/user';
import { Button } from '@/ui/button';
import { useMutation } from '@tanstack/react-query';

export const UpgradeSubscriptionForm = (data: {
  type: SubscriptionType;
  period: SubscriptionPeriod;
}) => {
  const {
    status,
    data: responseData,
    mutate,
  } = useMutation({
    mutationFn: (params: {
      type: SubscriptionType;
      period: SubscriptionPeriod;
    }) => createCheckoutSession(params),
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'success') {
      window.location.href = responseData!.url;
    }
  }, [status, navigate]);

  return (
    <Button
      className={'w-full'}
      variant={'warning'}
      onClick={() => mutate(data)}
      loading={status === 'pending'}
    >
      Upgrade
    </Button>
  );
};
