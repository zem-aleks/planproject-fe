import { useEffect } from 'react';

import { RefreshCcw } from 'lucide-react';

import { useLazyMutation, usePollingQuery } from '@/lib/adapters';
import { queryKeys } from '@/lib/queryKeys';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { generateProjectLogo } from '@/modules/shaping/api/generateProjectLogo';
import { getProjectLogo } from '@/modules/shaping/api/getProjectLogo';
import { Button } from '@/ui/button';
import { Skeleton } from '@/ui/skeleton';
import { notReachable } from '@/utils/notReachable';

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
  const { state, load } = useLazyMutation({ mutationFn: generateProjectLogo });

  switch (state.type) {
    case 'loading':
      return (
        <Skeleton className="size-16 shrink-0 rounded-md bg-blue-100 md:size-32" />
      );

    case 'error':
    case 'not_requested':
      return (
        <Button
          className="size-16 shrink-0 rounded-md bg-blue-100 md:size-32"
          aria-label={'Generate logo'}
          onClick={() => load(projectId)}
        >
          <RefreshCcw className={'size-14'} />
        </Button>
      );

    case 'loaded':
      return (
        <div className={`size-16 shrink-0 rounded-md bg-white md:size-32`}>
          {state.data.logoUrl && (
            <img
              src={state.data.logoUrl}
              alt="Project Logo"
              className="h-full w-full rounded-md object-contain object-center"
            />
          )}
        </div>
      );

    default:
      return notReachable(state);
  }
};

type LogoData = Awaited<ReturnType<typeof getProjectLogo>>;

const LogoPoller = ({ projectId }: { projectId: string }) => {
  const { state, stopPolling } = usePollingQuery<LogoData>({
    queryKey: queryKeys.projectLogo.byProject(projectId),
    queryFn: ({ signal }) => getProjectLogo(projectId, { signal }),
    interval: 5000,
  });

  useEffect(() => {
    if (state.type === 'loaded' && state.data?.logoUrl !== 'loading') {
      stopPolling();
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  switch (state.type) {
    case 'loading':
      return (
        <Skeleton className="size-16 shrink-0 rounded-md bg-blue-100 md:size-32" />
      );

    case 'stopped':
    case 'reloading':
    case 'loaded':
      if (state.data?.logoUrl === 'loading')
        return (
          <Skeleton className="size-16 shrink-0 rounded-md bg-blue-100 md:size-32" />
        );
      return (
        <div className={`size-16 shrink-0 rounded-md bg-white md:size-32`}>
          {state.data?.logoUrl && (
            <img
              src={state.data.logoUrl}
              alt="Project Logo"
              className="h-full w-full rounded-md object-contain object-center"
            />
          )}
        </div>
      );

    case 'error':
      return <LogoGenerator projectId={projectId} />;

    default:
      return notReachable(state);
  }
};
