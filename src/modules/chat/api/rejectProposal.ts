import { api } from '@/modules/api/api';

export const rejectProposal = async ({
  projectId,
  chatId,
  proposalId,
}: {
  projectId: string;
  chatId: string;
  proposalId: string;
}): Promise<{ status: 'rejected' }> => {
  return api.post(
    `/projects/${projectId}/chats/${chatId}/proposals/${proposalId}/reject`,
    {},
  );
};
