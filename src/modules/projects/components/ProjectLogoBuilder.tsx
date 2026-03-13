import { useEffect, useState } from 'react';

import type { AxiosError } from 'axios';
import { RefreshCcw } from 'lucide-react';

import { queryClient } from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys';
import { regenerateProjectLogo } from '@/modules/projects/api/regenerateProjectLogo';
import type { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { generateProjectLogo } from '@/modules/shaping/api/generateProjectLogo';
import { getProjectLogo } from '@/modules/shaping/api/getProjectLogo';
import { Button } from '@/ui/button';
import { Skeleton } from '@/ui/skeleton';
import { notReachable } from '@/utils/notReachable';
import { useMutation, useQuery } from '@tanstack/react-query';

export const ProjectLogoBuilder = ({
  project,
}: {
  project: ProjectPreviewEntity;
}) => {
  if (!project.logoUrl) {
    return <LogoGenerator projectId={project.id} />;
  }

  if (project.logoUrl === 'loading') {
    return <LogoPoller projectId={project.id} />;
  }

  return <LogoDisplay projectId={project.id} logoUrl={project.logoUrl} />;
};

const LogoDisplay = ({
  projectId,
  logoUrl,
}: {
  projectId: string;
  logoUrl: string;
}) => {
  const { status, mutate } = useMutation({
    mutationFn: (id: string) => regenerateProjectLogo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.list() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(projectId),
      });
    },
  });

  if (status === 'pending') {
    return (
      <Skeleton className="size-16 shrink-0 rounded-md bg-blue-100 md:size-32" />
    );
  }

  return (
    <div className="group relative size-16 shrink-0 rounded-md bg-white md:size-32">
      <img
        src={logoUrl}
        alt="Project Logo"
        className="h-full w-full rounded-md object-contain object-center"
      />
      <Button
        variant="secondary"
        size="icon"
        className="absolute right-1 bottom-1 hidden size-6 opacity-80 group-hover:flex hover:opacity-100"
        aria-label="Regenerate logo"
        onClick={() => mutate(projectId)}
      >
        <RefreshCcw className="size-3.5" />
      </Button>
    </div>
  );
};

const LogoGenerator = ({ projectId }: { projectId: string }) => {
  const { status, data, mutate } = useMutation({
    mutationFn: (projectId: string) => generateProjectLogo(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.list() });
    },
  });

  switch (status) {
    case 'pending':
      return (
        <Skeleton className="size-16 shrink-0 rounded-md bg-blue-100 md:size-32" />
      );

    case 'error':
    case 'idle':
      return (
        <Button
          className="size-16 shrink-0 rounded-md bg-blue-100 md:size-32"
          aria-label={'Generate logo'}
          onClick={() => mutate(projectId)}
        >
          <RefreshCcw className={'size-14'} />
        </Button>
      );

    case 'success':
      return (
        <div className={`size-16 shrink-0 rounded-md bg-white md:size-32`}>
          {data!.logoUrl && (
            <img
              src={data!.logoUrl}
              alt="Project Logo"
              className="h-full w-full rounded-md object-contain object-center"
            />
          )}
        </div>
      );

    default:
      return notReachable(status);
  }
};

type LogoData = Awaited<ReturnType<typeof getProjectLogo>>;

const LogoPoller = ({ projectId }: { projectId: string }) => {
  const [polling, setPolling] = useState(true);
  const { data, status } = useQuery<LogoData, AxiosError<Error>>({
    queryKey: queryKeys.projectLogo.byProject(projectId),
    queryFn: ({ signal }) => getProjectLogo(projectId, { signal }),
    refetchInterval: polling ? 5000 : false,
  });

  useEffect(() => {
    if (status === 'success' && data?.logoUrl !== 'loading') {
      setPolling(false);
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.list() });
    }
  }, [status, data]);

  switch (status) {
    case 'pending':
      return (
        <Skeleton className="size-16 shrink-0 rounded-md bg-blue-100 md:size-32" />
      );

    case 'success':
      if (data?.logoUrl === 'loading')
        return (
          <Skeleton className="size-16 shrink-0 rounded-md bg-blue-100 md:size-32" />
        );
      return (
        <div className={`size-16 shrink-0 rounded-md bg-white md:size-32`}>
          {data?.logoUrl && (
            <img
              src={data.logoUrl}
              alt="Project Logo"
              className="h-full w-full rounded-md object-contain object-center"
            />
          )}
        </div>
      );

    case 'error':
      return <LogoGenerator projectId={projectId} />;

    default:
      return notReachable(status);
  }
};
