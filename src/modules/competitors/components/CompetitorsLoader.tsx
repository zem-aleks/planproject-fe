import { ReactNode } from 'react';
import { Link } from 'react-router';

import { getCompetitors } from '@/modules/competitors/api/getCompetitors';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { Button } from '@/ui/button.tsx';
import { Card } from '@/ui/card';
import { Separator } from '@/ui/separator';
import { Skeleton } from '@/ui/skeleton';
import { notReachable } from '@/utils/notReachable.ts';
import { useLoadableData } from '@/utils/useLoadableData';

type Props = {
  project: ProjectEntity;
};

export const CompetitorsLoader = ({ project }: Props): ReactNode => {
  const { state, reload } = useLoadableData(getCompetitors, project.id);

  switch (state.type) {
    case 'error':
      return (
        <Card className={'flex flex-col items-center gap-2 py-4'}>
          <p className={'text-xl text-red-700'}>Competitors loading error</p>
          <p className={'pb-2'}>{state.error.message}</p>
          <Button onClick={reload}>Try again</Button>
        </Card>
      );

    case 'loading':
      return (
        <div className={'flex flex-col gap-2'}>
          <Skeleton className={'h-20 w-full'} />
          <Skeleton className={'h-20 w-full'} />
          <Skeleton className={'h-20 w-full'} />
          <Skeleton className={'h-20 w-full'} />
          <Skeleton className={'h-20 w-full'} />
          <Skeleton className={'h-20 w-full'} />
        </div>
      );

    case 'loaded':
      return (
        <div className={'flex flex-col gap-2'}>
          {state.data.map((competitor) => (
            <Card className={'flex justify-between gap-4 p-4 py-2'}>
              <div className={'flex gap-4'}>
                <div
                  className={
                    'mt-2 flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-amber-600 text-xl font-semibold'
                  }
                >
                  {competitor.competitionRating}
                </div>

                <div>
                  <div className={'text-2xl font-semibold'}>
                    {competitor.title}
                  </div>
                  <div>
                    {competitor.description} {competitor.whyCompetitor}
                  </div>
                  {competitor.url && (
                    <div>
                      <Link
                        to={competitor.url}
                        className={'text-pink-700'}
                        target={'_blank'}
                        rel="noreferrer"
                      >
                        {competitor.url}
                      </Link>
                    </div>
                  )}

                  <Separator className={'my-2'} />

                  <div>
                    <b>USP:</b> {competitor.usp}
                  </div>
                  <div>
                    <b>Experience to reuse:</b> {competitor.experienceToReuse}
                  </div>
                  <div>
                    <b>Users data:</b> {competitor.usersStats}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      );

    default:
      return notReachable(state);
  }
};
