import { ReactNode, useEffect } from 'react';

import { getPhases } from '@/modules/phases/api/getPhases';
import { PhaseEntityWithMilestones } from '@/modules/phases/types/entity';
import { Button } from '@/ui/button.tsx';
import { Card } from '@/ui/card';
import { Skeleton } from '@/ui/skeleton.tsx';
import { notReachable } from '@/utils/notReachable.ts';
import { usePollingData } from '@/utils/usePollableData';

type Props = {
  projectId: string;
  children: (
    chat: PhaseEntityWithMilestones[],
    reload: () => void,
    setData: (data: PhaseEntityWithMilestones[]) => void,
  ) => ReactNode;
};

export const PhasesLoader = ({ projectId, children }: Props): ReactNode => {
  // const { reload: reloadProjects } = useContext(ProjectsContext);
  // const { state, reload, setData } = useReloadableData(getPhases, projectId);

  const { state, reload, setData, stopPolling } = usePollingData(
    getPhases,
    projectId,
    3000,
  );

  useEffect(() => {
    if (
      state.type === 'loaded' &&
      state.data.length > 0 &&
      state.data.every((p) => p.status !== 'building')
    ) {
      stopPolling();
    }
  }, [state]);

  switch (state.type) {
    case 'loading':
      return (
        <div className="flex flex-1 flex-col gap-4">
          <Skeleton className="aspect-video rounded-xl" />
        </div>
      );

    case 'error':
      return (
        <Card className={'flex flex-col items-center gap-2 py-4'}>
          <p className={'text-xl text-red-700'}>Phases loading error</p>
          <p className={'text-muted-foreground pb-2'}>
            {state.error.response?.data.message || state.error.message}
          </p>
          <Button onClick={reload}>Try again</Button>
        </Card>
      );

    case 'reloading':
    case 'stopped':
    case 'loaded':
      if (!state.data || state.data.length === 0) {
        return (
          <div className="flex flex-1 flex-col gap-4">
            <Skeleton className="aspect-video rounded-xl" />
          </div>
        );
      }

      return <>{children(state.data, reload, setData)}</>;

    default:
      return notReachable(state);
  }
};

// export const PhasesPoller = ({
//   projectId,
//   children,
//   onLoaded,
// }: Props & { onLoaded: () => void }): ReactNode => {
//   const { state, reload, setData, stopPolling } = usePollingData(
//     getPhases,
//     projectId,
//     3000,
//   );
//
//   useEffect(() => {
//     if (
//       state.type === 'loaded' &&
//       state.data.length > 0 &&
//       state.data[0].status !== 'building'
//     ) {
//       stopPolling();
//       onLoaded();
//     }
//   }, [state]);
//
//   switch (state.type) {
//     case 'loading':
//       return (
//         <div className="flex flex-1 flex-col gap-4">
//           <Skeleton className="aspect-video rounded-xl" />
//         </div>
//       );
//
//     case 'error':
//       return (
//         <div className={'flex flex-col items-center gap-2 py-4'}>
//           <p className={'text-xl text-red-700'}>Phases loading error</p>
//           <p className={'text-muted-foreground pb-2'}>{state.error.message}</p>
//           <Button onClick={reload}>Try again</Button>
//         </div>
//       );
//
//     case 'stopped': {
//       if (!state.data) {
//         return (
//           <div className={'flex flex-col items-center gap-2 py-4'}>
//             <p className={'text-xl text-red-700'}>Phases loading stopped</p>
//             <p className={'text-muted-foreground pb-2'}>
//               Please press button below to load the data
//             </p>
//             <Button onClick={reload}>Load Phases</Button>
//           </div>
//         );
//       }
//       return <>{children(state.data, reload, setData)}</>;
//     }
//
//     case 'reloading':
//     case 'loaded':
//       if (state.data.length > 0) {
//         return <>{children(state.data, reload, setData)}</>;
//       }
//
//       return (
//         <div className="flex flex-1 flex-col gap-4">
//           <Skeleton className="aspect-video rounded-xl" />
//         </div>
//       );
//
//     default:
//       return notReachable(state);
//   }
// };
