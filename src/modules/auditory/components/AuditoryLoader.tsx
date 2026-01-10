import { ReactNode } from 'react';

import { getAuditory } from '@/modules/auditory/api/getAuditory';
import { AuditoryContent } from '@/modules/auditory/components/AuditoryContent';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { Button } from '@/ui/button.tsx';
import { Card } from '@/ui/card';
import { Skeleton } from '@/ui/skeleton';
import { notReachable } from '@/utils/notReachable.ts';
import { useLoadableData } from '@/utils/useLoadableData';

type Props = {
  project: ProjectEntity;
};

export const AuditoryLoader = ({ project }: Props): ReactNode => {
  const { state, reload } = useLoadableData(getAuditory, project.id);

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

    case 'loaded':
      return <AuditoryContent project={project} auditory={state.data} />;

    default:
      return notReachable(state);
  }
};
