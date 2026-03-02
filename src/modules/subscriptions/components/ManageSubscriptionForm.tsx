import { useEffect } from 'react';

import { createPortalSession } from '@/modules/subscriptions/api/createPortalSession';
import { Button } from '@/ui/button';
import { useMutation } from '@tanstack/react-query';

export const ManageSubscriptionForm = () => {
  const { status, data, mutate } = useMutation({
    mutationFn: () => createPortalSession(),
  });

  useEffect(() => {
    if (status === 'success') {
      window.location.href = data!.url;
    }
  }, [status]);

  return (
    <Button
      variant={'default'}
      onClick={() => mutate()}
      loading={status === 'pending'}
    >
      Manage Subscription
    </Button>
  );
};
