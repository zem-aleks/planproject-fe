import { useEffect } from 'react';

import { createPortalSession } from '@/modules/subscriptions/api/createPortalSession';
import { Button } from '@/ui/button';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData';

export const ManageSubscriptionForm = () => {
  const { state, load } = useLazyLoadableData(createPortalSession);

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
