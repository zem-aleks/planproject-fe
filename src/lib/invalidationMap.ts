import { queryKeys } from './queryKeys';

export const invalidationMap = {
  applySoulQueue: (projectId: string) => [
    queryKeys.projects.detail(projectId),
    queryKeys.projects.list(),
    queryKeys.phases.byProject(projectId),
    queryKeys.projects.progress(projectId),
    queryKeys.timeline.today(projectId),
    queryKeys.timeline.history(projectId),
    // Milestones and tasks use object filters — invalidate all
    ['milestones'],
    ['tasks'],
  ],
  addToSoulQueue: (projectId: string) => [queryKeys.projects.detail(projectId)],
  removeFromSoulQueue: (projectId: string) => [
    queryKeys.projects.detail(projectId),
  ],
  approveProposal: (projectId: string) => [
    queryKeys.projects.detail(projectId),
  ],
  startProject: (projectId: string) => [
    queryKeys.projects.detail(projectId),
    queryKeys.projects.list(),
    queryKeys.phases.byProject(projectId),
  ],
  updateProject: (projectId: string) => [
    queryKeys.projects.detail(projectId),
    queryKeys.projects.list(),
  ],
  deleteProject: (projectId: string) => [
    queryKeys.projects.detail(projectId),
    queryKeys.projects.list(),
  ],
  startPhase: (projectId: string) => [
    queryKeys.phases.byProject(projectId),
    queryKeys.projects.detail(projectId),
    queryKeys.projects.progress(projectId),
  ],
  completePhase: (projectId: string) => [
    queryKeys.phases.byProject(projectId),
    queryKeys.projects.detail(projectId),
    queryKeys.projects.progress(projectId),
  ],
  modifyPhases: (projectId: string) => [
    queryKeys.phases.byProject(projectId),
    queryKeys.projects.detail(projectId),
  ],
  completeMilestone: (projectId: string, phaseId: string) => [
    queryKeys.milestones.byPhase(phaseId),
    queryKeys.phases.byProject(projectId),
    queryKeys.projects.progress(projectId),
    queryKeys.timeline.today(projectId),
    queryKeys.tasks.active(projectId),
  ],
  toggleStep: (phaseId: string) => [queryKeys.milestones.byPhase(phaseId)],
  completeTask: (projectId: string, milestoneId: string, phaseId: string) => [
    queryKeys.tasks.byMilestone(milestoneId),
    queryKeys.tasks.active(projectId),
    queryKeys.milestones.byPhase(phaseId),
  ],
  createChat: (projectId: string) => [queryKeys.chats.byProject(projectId)],
  deleteChat: (projectId: string) => [queryKeys.chats.byProject(projectId)],
};
