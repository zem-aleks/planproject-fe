import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';

export const getProjectProgress = async (
  projectId: string,
  config?: AxiosRequestConfig,
): Promise<ProjectProgress> => {
  return api.get(`/projects/${projectId}/progress`, {
    signal: config?.signal,
  });
};

type ProjectProgress = {
  projectProgress: number;
  diffWithPlanDays: number;
  confirmedDiffWithPlanDays: number;
  phasesCount: number;
  phasesCompletedCount: number;
  milestonesCount: number;
  milestonesCompletedCount: number;
  milestonesCompletedDaysNeeded: number;
};
