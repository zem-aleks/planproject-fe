import { useEffect } from 'react';

import { RefreshCcw } from 'lucide-react';

import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { generateProjectLogo } from '@/modules/shaping/api/generateProjectLogo';
import { getProjectLogo } from '@/modules/shaping/api/getProjectLogo';
import { Button } from '@/ui/button';
import { Skeleton } from '@/ui/skeleton';
import { notReachable } from '@/utils/notReachable';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData';
import { usePollingData } from '@/utils/usePollableData';

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
    <div className={`size-[128px] shrink-0 rounded-md bg-white`}>
      <img
        src={project.logoUrl}
        alt="Project Logo"
        className="h-full w-full rounded-md object-contain object-center"
      />
    </div>
  );
};

const LogoGenerator = ({ projectId }: { projectId: string }) => {
  const { state, load } = useLazyLoadableData(generateProjectLogo);

  switch (state.type) {
    case 'loading':
      return (
        <Skeleton className="size-[128px] shrink-0 rounded-md bg-blue-100" />
      );

    case 'error':
    case 'not_requested':
      return (
        <Button
          className="size-[128px] shrink-0 rounded-md bg-blue-100"
          aria-label={'Generate logo'}
          onClick={() => load(projectId)}
        >
          <RefreshCcw className={'size-14'} />
        </Button>
      );

    case 'loaded':
      return (
        <div className={`size-[128px] shrink-0 rounded-md bg-white`}>
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

const LogoPoller = ({ projectId }: { projectId: string }) => {
  const { state, stopPolling } = usePollingData(
    getProjectLogo,
    projectId,
    5000,
  );

  useEffect(() => {
    if (state.type === 'loaded' && state.data?.logoUrl !== 'loading') {
      stopPolling();
    }
  }, [state]);

  switch (state.type) {
    case 'loading':
      return (
        <Skeleton className="size-[128px] shrink-0 rounded-md bg-blue-100" />
      );

    case 'stopped':
    case 'reloading':
    case 'loaded':
      if (state.data?.logoUrl === 'loading')
        return (
          <Skeleton className="size-[128px] shrink-0 rounded-md bg-blue-100" />
        );
      return (
        <div className={`size-[128px] shrink-0 rounded-md bg-white`}>
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
