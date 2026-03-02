import { ReactNode, useEffect } from 'react';

import { usePollingQuery } from '@/lib/adapters';
import { queryKeys } from '@/lib/queryKeys';
import { getAuditory } from '@/modules/auditory/api/getAuditory';
import { AuditoryContent } from '@/modules/auditory/components/AuditoryContent';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { Button } from '@/ui/button.tsx';
import { Card } from '@/ui/card';
import { Skeleton } from '@/ui/skeleton';
import { notReachable } from '@/utils/notReachable.ts';

type AuditoryData = Awaited<ReturnType<typeof getAuditory>>;

type Props = {
  project: ProjectPreviewEntity;
};

export const AuditoryLoader = ({ project }: Props): ReactNode => {
  const { state, reload, stopPolling } = usePollingQuery<AuditoryData>({
    queryKey: queryKeys.auditory.byProject(project.id),
    queryFn: ({ signal }) => getAuditory(project.id, { signal }),
    interval: 3000,
  });

  useEffect(() => {
    if (state.type === 'loaded' || state.type === 'reloading') {
      if (state.data !== null) {
        stopPolling();
      }
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  switch (state.type) {
    case 'error':
      return (
        <Card className={'flex flex-col items-center gap-2 py-4'}>
          <p className={'text-xl text-red-700'}>Auditory loading error</p>
          <p className={'pb-2'}>{state.error.message}</p>
          <Button onClick={reload}>Try again</Button>
        </Card>
      );

    case 'loading':
      return (
        <div className={'flex flex-col gap-2'}>
          <Skeleton className={'h-40 w-full'} />
        </div>
      );

    case 'stopped':
    case 'reloading':
    case 'loaded':
      if (!state.data) {
        return (
          <div className={'flex flex-col gap-2'}>
            <Skeleton className={'h-40 w-full'} />
          </div>
        );
      }

      return <AuditoryContent project={project} auditory={state.data} />;

    default:
      return notReachable(state);
  }
};
