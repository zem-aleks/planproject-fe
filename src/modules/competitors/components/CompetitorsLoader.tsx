import { ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router';

import type { AxiosError } from 'axios';
import { ShieldEllipsis } from 'lucide-react';

import { queryKeys } from '@/lib/queryKeys';
import { useUser } from '@/modules/auth/contexts/UserContext';
import { getCompetitors } from '@/modules/competitors/api/getCompetitors';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { Button } from '@/ui/button.tsx';
import { Card } from '@/ui/card';
import { Separator } from '@/ui/separator';
import { Skeleton } from '@/ui/skeleton';
import { notReachable } from '@/utils/notReachable.ts';
import { useQuery } from '@tanstack/react-query';

type CompetitorData = Awaited<ReturnType<typeof getCompetitors>>;

type Props = {
  project: ProjectPreviewEntity;
};

export const CompetitorsLoader = ({ project }: Props): ReactNode => {
  const { user } = useUser();
  const [polling, setPolling] = useState(true);
  const { data, error, status, refetch } = useQuery<
    CompetitorData,
    AxiosError<Error>
  >({
    queryKey: queryKeys.competitors.byProject(project.id),
    queryFn: ({ signal }) => getCompetitors(project.id, { signal }),
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
          <p className={'text-xl text-red-700'}>Competitors loading error</p>
          <p className={'pb-2'}>
            {error.response?.data.message || error.message}
          </p>
          <Button onClick={() => refetch()}>Try again</Button>
        </Card>
      );

    case 'pending':
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

    case 'success':
      if (!data) {
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
      }

      return (
        <div className={'flex flex-col gap-2'}>
          {data.map((competitor) => (
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

          {user?.subscription === 'basic' && (
            <Card className={'flex items-center justify-center gap-4 p-4 py-8'}>
              <div className={'text-center'}>
                <div className={'text-foreground mb-2 text-2xl font-semibold'}>
                  Upgrade Subscription to get more competitors data
                </div>
                <div className={'text-muted-foreground text-center'}>
                  More competitors data can be unlocked on <b>Pro</b> and{' '}
                  <b>Business</b> plans
                </div>
              </div>
              <ShieldEllipsis className={'my-4 size-20 text-orange-400'} />
              <Button variant={'default'} asChild>
                <Link to={'/account'}>Upgrade Subscription</Link>
              </Button>
            </Card>
          )}

          {user?.subscription === 'pro' && (
            <Card className={'flex items-center justify-center gap-4 p-4 py-8'}>
              <div className={'text-center'}>
                <div className={'text-foreground mb-2 text-2xl font-semibold'}>
                  Upgrade Subscription to get more competitors data
                </div>
                <div className={'text-muted-foreground text-center'}>
                  More competitors data can be unlocked on <b>Business</b> plan
                </div>
              </div>
              <ShieldEllipsis className={'my-4 size-20 text-orange-400'} />
              <Button variant={'default'} asChild>
                <Link to={'/account'}>Upgrade Subscription</Link>
              </Button>
            </Card>
          )}
        </div>
      );

    default:
      return notReachable(status);
  }
};
