export const queryKeys = {
  projects: {
    list: () => ['projects', 'list'] as const,
    detail: (projectId: string) => ['projects', projectId] as const,
    progress: (projectId: string) =>
      ['projects', projectId, 'progress'] as const,
  },
  phases: {
    byProject: (projectId: string) => ['phases', { projectId }] as const,
    detail: (phaseId: string) => ['phases', phaseId] as const,
  },
  milestones: {
    byPhase: (phaseId: string) => ['milestones', { phaseId }] as const,
    detail: (milestoneId: string) => ['milestones', milestoneId] as const,
  },
  tasks: {
    byMilestone: (milestoneId: string) => ['tasks', { milestoneId }] as const,
    active: (projectId: string) => ['tasks', 'active', { projectId }] as const,
  },
  chats: {
    byProject: (projectId: string) => ['chats', { projectId }] as const,
    detail: (chatId: string) => ['chats', chatId] as const,
  },
  timeline: {
    today: (projectId: string) => ['timeline', 'today', projectId] as const,
    history: (projectId: string) => ['timeline', 'history', projectId] as const,
    focusComment: (projectId: string) =>
      ['timeline', 'focusComment', projectId] as const,
  },
  shaping: {
    detail: (projectId: string) => ['shaping', projectId] as const,
    start: (clientId: string) => ['shaping', 'start', clientId] as const,
  },
  competitors: {
    byProject: (projectId: string) => ['competitors', projectId] as const,
  },
  auditory: {
    byProject: (projectId: string) => ['auditory', projectId] as const,
  },
  subscription: {
    current: () => ['subscription'] as const,
  },
  user: {
    current: () => ['user'] as const,
  },
  projectLogo: {
    byProject: (projectId: string) => ['projectLogo', projectId] as const,
  },
};
