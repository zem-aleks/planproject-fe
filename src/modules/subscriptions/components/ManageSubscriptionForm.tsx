import { useEffect } from 'react';

import { useLazyMutation } from '@/lib/adapters';
import { createPortalSession } from '@/modules/subscriptions/api/createPortalSession';
import { Button } from '@/ui/button';

export const ManageSubscriptionForm = () => {
  const { state, load } = useLazyMutation({ mutationFn: createPortalSession });

  useEffect(() => {
    if (state.type === 'loaded') {
      window.location.href = state.data.url;
    }
  }, [state]);

  return (
    <Button
      variant={'default'}
      onClick={() => load()}
      loading={state.type === 'loading'}
    >
      Manage Subscription
    </Button>
  );
};
