import { useEffect } from 'react';
import { useLocation } from 'react-router';

import { pageview } from '@/modules/analytics/utils/pageview';

export const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location]);

  return null;
};
