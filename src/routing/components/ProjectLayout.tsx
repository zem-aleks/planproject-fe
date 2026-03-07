import { useCallback, useState } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router';

import type { AxiosError } from 'axios';

import { queryKeys } from '@/lib/queryKeys';
import type { ProposalRevert } from '@/modules/chat/components/ChatConversation';
import { getProject } from '@/modules/projects/api/getProject';
import type { ProjectEntity } from '@/modules/projects/types/entity';
import { SoulQueueSnackbar } from '@/modules/soul/components/SoulQueueSnackbar';
import { useQuery } from '@tanstack/react-query';

type ProjectLayoutContext = {
  proposalToRevert: ProposalRevert | null;
};

export const useProjectLayoutContext = () =>
  useOutletContext<ProjectLayoutContext>();

export const ProjectLayout = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [proposalToRevert, setProposalToRevert] =
    useState<ProposalRevert | null>(null);

  const { data: project } = useQuery<ProjectEntity, AxiosError<Error>>({
    queryKey: queryKeys.projects.detail(projectId!),
    queryFn: ({ signal }) => getProject(projectId!, { signal }),
    enabled: !!projectId,
  });

  const handleApplyProposalReverted = useCallback(
    (messageId: string, proposalId: string) => {
      setProposalToRevert({ messageId, proposalId });
    },
    [],
  );

  return (
    <>
      <Outlet context={{ proposalToRevert } satisfies ProjectLayoutContext} />
      {project && (
        <SoulQueueSnackbar
          project={project}
          onApplyProposalReverted={handleApplyProposalReverted}
        />
      )}
    </>
  );
};
