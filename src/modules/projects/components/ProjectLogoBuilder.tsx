import { useEffect, useState } from 'react';

import type { AxiosError } from 'axios';
import { RefreshCcw } from 'lucide-react';

import { queryKeys } from '@/lib/queryKeys';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
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

  return (
    <div className={`size-16 shrink-0 rounded-md bg-white md:size-32`}>
      <img
        src={project.logoUrl}
        alt="Project Logo"
        className="h-full w-full rounded-md object-contain object-center"
      />
    </div>
  );
};

const LogoGenerator = ({ projectId }: { projectId: string }) => {
  const { status, data, mutate } = useMutation({
    mutationFn: (projectId: string) => generateProjectLogo(projectId),
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
    }
  }, [status, data]); // eslint-disable-line react-hooks/exhaustive-deps

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
