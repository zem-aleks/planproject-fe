import {
  SubscriptionPeriod,
  SubscriptionType,
} from '@/modules/users/types/user';

export type SubscriptionEntity = {
  type: SubscriptionType;
  period: SubscriptionPeriod;
  usedProjects: number;
  totalAvailableProjects: number;
  canActivate: boolean;
};
