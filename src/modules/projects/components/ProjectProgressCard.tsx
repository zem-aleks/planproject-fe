import dayjs from 'dayjs';

import { useLoadableQuery } from '@/lib/adapters';
import { queryKeys } from '@/lib/queryKeys';
import { getProjectProgress } from '@/modules/projects/api/getProjectProgress';
import { getDaySince } from '@/modules/projects/helpers/getDaySince';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { Card } from '@/ui/card';
import { Progress } from '@/ui/progress';
import { Skeleton } from '@/ui/skeleton';
import { notReachable } from '@/utils/notReachable';

type ProjectProgress = Awaited<ReturnType<typeof getProjectProgress>>;

export const ProjectProgressCard = ({
  project,
}: {
  project: ProjectPreviewEntity;
}) => {
  const { state } = useLoadableQuery<ProjectProgress>({
    queryKey: queryKeys.projects.progress(project.id),
    queryFn: ({ signal }) => getProjectProgress(project.id, { signal }),
  });

  switch (state.type) {
    case 'loading':
      return (
        <Card className={'flex flex-col gap-2 p-4 px-4'}>
          <div className={'flex items-center justify-between gap-2'}>
            <h2 className={'text-lg font-semibold'}>Project Progress</h2>
          </div>
          <Skeleton className={'mb-2 h-4 bg-gray-500'} />
        </Card>
      );

    case 'loaded':
      return (
        <Card className={'flex flex-col gap-2 p-4 px-4'}>
          <div className={'flex items-center justify-between gap-2'}>
            <h2 className={'text-lg font-semibold'}>
              Project Progress ({state.data.projectProgress}%)
            </h2>
          </div>

          <Progress
            value={state.data.projectProgress}
            className="mb-2 h-4 w-full"
          />

          <ul className={'list-inside list-disc'}>
            {state.data.diffWithPlanDays >= 0 ? (
              <li>
                Your progress is <b className={'text-green-600'}>On Track</b>
              </li>
            ) : (
              <li>
                Your are <b className={'text-red-600'}>progressing slower</b>{' '}
                than was initial estimation on{' '}
                <b className={'text-green-600'}>
                  {Math.abs(state.data.diffWithPlanDays)}
                </b>{' '}
                days
              </li>
            )}

            {state.data.confirmedDiffWithPlanDays > 0 && (
              <li>
                Faster on{' '}
                <b className={'text-green-600'}>
                  {Math.abs(state.data.confirmedDiffWithPlanDays)} days
                </b>
              </li>
            )}

            <li>
              <b className={'text-gray-900'}>
                {state.data.phasesCompletedCount} / {state.data.phasesCount}{' '}
                phases
              </b>{' '}
              are done
            </li>
            <li>
              <b className={'text-gray-900'}>
                {state.data.milestonesCompletedCount} /{' '}
                {state.data.milestonesCount} milestones
              </b>{' '}
              are done
            </li>
            {project.daysNeeded && (
              <>
                <li>
                  <b className={'text-gray-900'}>
                    {project.daysNeeded - getDaySince(project.startedAt)} days
                  </b>{' '}
                  left
                </li>
                <li>
                  You can <b>finish</b> your project till the{' '}
                  <b className={'text-green-600'}>
                    {dayjs(project.startedAt)
                      .add(
                        project.daysNeeded - state.data.diffWithPlanDays,
                        'days',
                      )
                      .format('D MMMM YYYY')}
                  </b>
                </li>
              </>
            )}
          </ul>
        </Card>
      );

    case 'error':
      break;

    default:
      return notReachable(state);
  }
};
