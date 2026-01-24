import { useEffect } from 'react';
import { Link } from 'react-router';

import { LockOpen, ShieldQuestion } from 'lucide-react';
import { toast } from 'sonner';

import { unlockProject } from '@/modules/projects/api/unlockProject';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { SubscriptionLoader } from '@/modules/subscriptions/components/SubscriptionLoader';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { notReachable } from '@/utils/notReachable';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData';

export const UnlockProjectForm = ({
  project,
  onUnlock,
}: {
  project: ProjectPreviewEntity;
  onUnlock: () => void;
}) => {
  const { state, load } = useLazyLoadableData(unlockProject);

  useEffect(() => {
    switch (state.type) {
      case 'not_requested':
      case 'loading':
        break;

      case 'error':
        toast.error(
          `Failed to unlock project: ${state.error.response?.data.message || state.error.message}`,
        );
        break;

      case 'loaded':
        onUnlock();
        break;

      default:
        return notReachable(state);
    }
  }, [state]);

  return (
    <Card className={'items-center justify-center gap-2 p-4 py-8'}>
      <div className={'text-center'}>
        <div className={'text-foreground mb-1 text-2xl font-semibold'}>
          Project is Locked
        </div>
        <div className={'text-muted-foreground text-center'}>
          You can unlock it if your subscription has enough quota
        </div>
      </div>
      <ShieldQuestion className={'my-4 size-20 text-orange-400'} />

      <SubscriptionLoader>
        {(subscription) => (
          <div className={'flex flex-col gap-4'}>
            <div className={'text-center'}>
              <div className={'text-lg'}>
                You used <b>{subscription.usedProjects}</b> /{' '}
                <b>{subscription.totalAvailableProjects}</b> projects
              </div>
              {subscription.canActivate ? (
                <div className={'text-muted-foreground'}>
                  Would you like to unlock this project?
                </div>
              ) : (
                <div className={'text-muted-foreground'}>
                  You can upgrade your subscription to get more projects
                </div>
              )}
            </div>

            {subscription.canActivate ? (
              <Button
                onClick={() => load(project.id)}
                loading={state.type === 'loading'}
              >
                <LockOpen />
                Unlock Project
              </Button>
            ) : (
              <Button variant={'default'} asChild>
                <Link to={'/account'}>Upgrade Subscription</Link>
              </Button>
            )}
          </div>
        )}
      </SubscriptionLoader>
    </Card>
  );
};
