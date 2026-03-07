import { useEffect } from 'react';

import type { AxiosError } from 'axios';
import { LoaderCircle } from 'lucide-react';

import { queryKeys } from '@/lib/queryKeys';
import { useAuthSession } from '@/modules/auth/contexts/AuthSessionContext';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { bindShaping } from '@/modules/shaping/api/bindShaping';
import { getStartShaping } from '@/modules/shaping/api/getStartShaping';
import { ShapingEntity } from '@/modules/shaping/types/entity';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { notReachable } from '@/utils/notReachable';
import { useLoadableData } from '@/utils/useLoadableData';
import { useQuery } from '@tanstack/react-query';

type Msg =
  | { type: 'onConnected'; project: ProjectEntity }
  | { type: 'onNothingToConnect' };

export const NewProjectsChecker = ({
  onMsg,
}: {
  onMsg: (msg: Msg) => void;
}) => {
  const { clientId } = useAuthSession();
  const { data, status } = useQuery<ShapingEntity | null, AxiosError<Error>>({
    queryKey: queryKeys.shaping.start(clientId),
    queryFn: ({ signal }) => getStartShaping(clientId, { signal }),
  });

  switch (status) {
    case 'pending':
    case 'error':
      return null;

    case 'success':
      if (!data) {
        onMsg({ type: 'onNothingToConnect' });
        return null;
      }
      return (
        <ShapingBinder
          shapingId={data.id}
          onConnected={(project) => onMsg({ type: 'onConnected', project })}
        />
      );

    default:
      return notReachable(status);
  }
};

export const ShapingBinder = ({
  shapingId,
  onConnected,
}: {
  shapingId: string;
  onConnected: (project: ProjectEntity) => void;
}) => {
  const { clientId } = useAuthSession();
  const { state, reload } = useLoadableData(bindShaping, {
    shapingId,
    clientId,
  });

  useEffect(() => {
    if (state.type === 'loaded') {
      onConnected(state.data);
    }
  }, [state]);

  switch (state.type) {
    case 'loading':
      return (
        <Card
          className={'mx-4 flex flex-row gap-2 bg-green-600 p-2 text-white'}
        >
          <LoaderCircle className={'animate-spin'} />
          <div className={'text-lg'}>Connecting new projects...</div>
        </Card>
      );

    case 'loaded':
      return null;

    case 'error':
      return (
        <Card
          className={'mx-4 flex flex-row gap-2 bg-green-600 p-2 text-white'}
        >
          Something went wrong
          <Button onClick={reload}>Try again</Button>
        </Card>
      );

    default:
      return notReachable(state);
  }
};
