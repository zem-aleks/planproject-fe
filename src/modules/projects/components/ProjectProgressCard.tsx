import type { AxiosError } from 'axios';
import dayjs from 'dayjs';

import { queryKeys } from '@/lib/queryKeys';
import { getProjectProgress } from '@/modules/projects/api/getProjectProgress';
import { getDaySince } from '@/modules/projects/helpers/getDaySince';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { Card } from '@/ui/card';
import { Progress } from '@/ui/progress';
import { Skeleton } from '@/ui/skeleton';
import { notReachable } from '@/utils/notReachable';
import { useQuery } from '@tanstack/react-query';

type ProjectProgress = Awaited<ReturnType<typeof getProjectProgress>>;

export const ProjectProgressCard = ({
  project,
}: {
  project: ProjectPreviewEntity;
}) => {
  const { data, status } = useQuery<ProjectProgress, AxiosError<Error>>({
    queryKey: queryKeys.projects.progress(project.id),
    queryFn: ({ signal }) => getProjectProgress(project.id, { signal }),
  });

  switch (status) {
    case 'pending':
      return (
        <Card className={'flex flex-col gap-2 p-4 px-4'}>
          <div className={'flex items-center justify-between gap-2'}>
            <h2 className={'text-lg font-semibold'}>Project Progress</h2>
          </div>
          <Skeleton className={'mb-2 h-4 bg-gray-500'} />
        </Card>
      );

    case 'success':
      return (
        <Card className={'flex flex-col gap-2 p-4 px-4'}>
          <div className={'flex items-center justify-between gap-2'}>
            <h2 className={'text-lg font-semibold'}>
              Project Progress ({data!.projectProgress}%)
            </h2>
          </div>

          <Progress value={data!.projectProgress} className="mb-2 h-4 w-full" />

          <ul className={'list-inside list-disc'}>
            {data!.diffWithPlanDays >= 0 ? (
              <li>
                Your progress is <b className={'text-green-600'}>On Track</b>
              </li>
            ) : (
              <li>
                Your are <b className={'text-red-600'}>progressing slower</b>{' '}
                than was initial estimation on{' '}
                <b className={'text-green-600'}>
                  {Math.abs(data!.diffWithPlanDays)}
                </b>{' '}
                days
              </li>
            )}

            {data!.confirmedDiffWithPlanDays > 0 && (
              <li>
                Faster on{' '}
                <b className={'text-green-600'}>
                  {Math.abs(data!.confirmedDiffWithPlanDays)} days
                </b>
              </li>
            )}

            <li>
              <b className={'text-gray-900'}>
                {data!.phasesCompletedCount} / {data!.phasesCount} phases
              </b>{' '}
              are done
            </li>
            <li>
              <b className={'text-gray-900'}>
                {data!.milestonesCompletedCount} / {data!.milestonesCount}{' '}
                milestones
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
                      .add(project.daysNeeded - data!.diffWithPlanDays, 'days')
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
      return notReachable(status);
  }
};
