import { SubscriptionType } from '@/modules/auth/types/user';

export const SUBSCRIPTION_TITLES: Record<SubscriptionType, string> = {
  basic: 'Basic Plan',
  pro: 'Pro Plan',
  business: 'Business Plan',
};
