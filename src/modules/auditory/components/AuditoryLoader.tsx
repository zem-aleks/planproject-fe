import { ReactNode, useEffect, useState } from 'react';

import type { AxiosError } from 'axios';

import { queryKeys } from '@/lib/queryKeys';
import { getAuditory } from '@/modules/auditory/api/getAuditory';
import { AuditoryContent } from '@/modules/auditory/components/AuditoryContent';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { Button } from '@/ui/button.tsx';
import { Card } from '@/ui/card';
import { Skeleton } from '@/ui/skeleton';
import { notReachable } from '@/utils/notReachable.ts';
import { useQuery } from '@tanstack/react-query';

type AuditoryData = Awaited<ReturnType<typeof getAuditory>>;

type Props = {
  project: ProjectPreviewEntity;
};

export const AuditoryLoader = ({ project }: Props): ReactNode => {
  const [polling, setPolling] = useState(true);
  const { data, error, status, refetch } = useQuery<
    AuditoryData,
    AxiosError<Error>
  >({
    queryKey: queryKeys.auditory.byProject(project.id),
    queryFn: ({ signal }) => getAuditory(project.id, { signal }),
    refetchInterval: polling ? 3000 : false,
  });

  useEffect(() => {
    if (status === 'success' && data !== null) {
      setPolling(false);
    }
  }, [status, data]); // eslint-disable-line react-hooks/exhaustive-deps

  switch (status) {
    case 'error':
      return (
        <Card className={'flex flex-col items-center gap-2 py-4'}>
          <p className={'text-xl text-red-700'}>Auditory loading error</p>
          <p className={'pb-2'}>{error.message}</p>
          <Button onClick={() => refetch()}>Try again</Button>
        </Card>
      );

    case 'pending':
      return (
        <div className={'flex flex-col gap-2'}>
          <Skeleton className={'h-40 w-full'} />
        </div>
      );

    case 'success':
      if (!data) {
        return (
          <div className={'flex flex-col gap-2'}>
            <Skeleton className={'h-40 w-full'} />
          </div>
        );
      }

      return <AuditoryContent project={project} auditory={data} />;

    default:
      return notReachable(status);
  }
};
