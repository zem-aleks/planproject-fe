import { useEffect } from 'react';

import { LoaderCircle } from 'lucide-react';

import { useLoadableQuery } from '@/lib/adapters';
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

type Msg =
  | { type: 'onConnected'; project: ProjectEntity }
  | { type: 'onNothingToConnect' };

export const NewProjectsChecker = ({
  onMsg,
}: {
  onMsg: (msg: Msg) => void;
}) => {
  const { clientId } = useAuthSession();
  const { state } = useLoadableQuery<ShapingEntity | null>({
    queryKey: queryKeys.shaping.start(clientId),
    queryFn: ({ signal }) => getStartShaping(clientId, { signal }),
  });

  switch (state.type) {
    case 'loading':
    case 'error':
      return null;

    case 'loaded':
      if (!state.data) {
        onMsg({ type: 'onNothingToConnect' });
        return null;
      }
      return (
        <ShapingBinder
          shapingId={state.data.id}
          onConnected={(project) => onMsg({ type: 'onConnected', project })}
        />
      );

    default:
      return notReachable(state);
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
