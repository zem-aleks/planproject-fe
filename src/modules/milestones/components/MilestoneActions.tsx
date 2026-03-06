import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { Focus } from 'lucide-react';
import { toast } from 'sonner';

import { queryKeys } from '@/lib/queryKeys';
import { toggleFocusMilestone } from '@/modules/milestones/api/focusMilestone';
import type { MilestoneEntity } from '@/modules/milestones/types/entity';
import { Button } from '@/ui/button';
import { useQueryClient } from '@tanstack/react-query';

export const MilestoneActions = ({
  milestone,
}: {
  milestone: MilestoneEntity;
  onUpdated: (milestone: MilestoneEntity) => void;
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [focusing, setFocusing] = useState(false);

  const handleFocus = async () => {
    setFocusing(true);
    try {
      await toggleFocusMilestone(milestone.id);
      queryClient.removeQueries({
        queryKey: queryKeys.timeline.today(milestone.projectId),
      });
      navigate(`/project/${milestone.projectId}/focus`);
    } catch {
      toast.error('Failed to focus milestone');
      setFocusing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button variant="warning" className={'w-full py-2'} asChild>
        <Link
          to={`/project/${milestone.projectId}/milestone/${milestone.id}`}
          className="w-full"
        >
          View Details
        </Link>
      </Button>
      {milestone.status !== 'completed' && (
        <Button
          variant={milestone.focused ? 'secondary' : 'default'}
          className={'w-full py-2'}
          onClick={handleFocus}
          loading={focusing}
        >
          <Focus className="size-4" />
          {milestone.focused ? 'Focused' : 'Focus'}
        </Button>
      )}
    </div>
  );

  // const { state, load } = useLazyLoadableData(startMilestone);
  //
  // useEffect(() => {
  //   switch (state.type) {
  //     case 'not_requested':
  //     case 'loading':
  //       break;
  //
  //     case 'error':
  //       toast.error(`Failed to start the milestone. Please try again.`);
  //       break;
  //
  //     case 'loaded':
  //       onUpdated(state.data);
  //       break;
  //
  //     default:
  //       return notReachable(state);
  //   }
  // }, [state]);
  //
  // switch (milestone.status) {
  //   case 'notStarted':
  //     return (
  //       <Button
  //         onClick={() => load(milestone.id)}
  //         loading={state.type === 'loading'}
  //       >
  //         Start working on it now
  //       </Button>
  //     );
  //
  //   case 'completed':
  //     return (
  //       <div className={'flex flex-col gap-2'}>
  //         <Button variant="warning" className={'w-full py-2'} asChild>
  //           <Link
  //             to={`/project/${milestone.projectId}/milestone/${milestone.id}`}
  //             className="w-full"
  //           >
  //             Tasks
  //           </Link>
  //         </Button>
  //         <Badge variant="success" className={'w-full py-2'}>
  //           Completed
  //         </Badge>
  //         {milestone.completeMessage && (
  //           <div
  //             className={
  //               'text-muted-foreground bg-secondary rounded-lg p-2 px-4'
  //             }
  //           >
  //             <b>Comment:</b> {milestone.completeMessage}
  //           </div>
  //         )}
  //       </div>
  //     );
  //
  //   case 'inProgress':
  //     return <ActionsInProgress milestone={milestone} />;
  //
  //   default:
  //     return notReachable(milestone.status);
  // }
};

// const ActionsInProgress = ({ milestone }: { milestone: MilestoneEntity }) => {
//   // const { state } = useLoadableData(getTasks, milestone.id);
//
//   return (
//     <Button variant="warning" className={'w-full py-2'} asChild>
//       <Link
//         to={`/project/${milestone.projectId}/milestone/${milestone.id}`}
//         className="w-full"
//       >
//         View Details
//       </Link>
//     </Button>
//   );
//
//   // switch (state.type) {
//   //   case 'error':
//   //   case 'loading':
//   //     return (
//   //       <Button variant="warning" className={'w-full py-2'} asChild>
//   //         <Link
//   //           to={`/project/${milestone.projectId}/milestone/${milestone.id}`}
//   //           className="w-full"
//   //         >
//   //           Tasks
//   //         </Link>
//   //       </Button>
//   //     );
//   //
//   //   case 'loaded':
//   //     return (
//   //       <>
//   //         <Button variant="warning" className={'w-full py-2'} asChild>
//   //           <Link
//   //             to={`/project/${milestone.projectId}/milestone/${milestone.id}`}
//   //             className="w-full"
//   //           >
//   //             Tasks: {state.data.filter((t) => t.status === 'completed').length}{' '}
//   //             / {state.data.length}
//   //           </Link>
//   //         </Button>
//   //       </>
//   //     );
//   //
//   //   default:
//   //     return notReachable(state);
//   // }
// };
