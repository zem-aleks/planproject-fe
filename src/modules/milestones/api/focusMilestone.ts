import type { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import type { MilestoneEntity } from '@/modules/milestones/types/entity';

export const toggleFocusMilestone = async (
  milestoneId: string,
  config?: AxiosRequestConfig,
): Promise<MilestoneEntity[]> => {
  return api.patch(
    `/milestones/${milestoneId}/toggle-focus`,
    {},
    {
      signal: config?.signal,
    },
  );
};
