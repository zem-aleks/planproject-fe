import { api } from '@/modules/api/api';
import type { ProjectEntity } from '@/modules/projects/types/entity';

export const approveProposal = async ({
  projectId,
  chatId,
  proposalId,
}: {
  projectId: string;
  chatId: string;
  proposalId: string;
}): Promise<ProjectEntity> => {
  return api.post(
    `/projects/${projectId}/chats/${chatId}/proposals/${proposalId}/approve`,
    {},
  );
};
