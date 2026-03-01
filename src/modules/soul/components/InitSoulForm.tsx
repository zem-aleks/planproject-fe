import { useEffect } from 'react';

import { AlertCircle, Sparkles } from 'lucide-react';

import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { initSoul } from '@/modules/soul/api/initSoul';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { notReachable } from '@/utils/notReachable';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData';

type Reason = 'no_soul' | 'error';

const getReasonFromProject = (project: ProjectPreviewEntity): Reason => {
  if (project.status === 'soulError') return 'error';
  return 'no_soul';
};

export const InitSoulForm = ({
  project,
  onInitiated,
}: {
  project: ProjectPreviewEntity;
  onInitiated: () => void;
}) => {
  const reason = getReasonFromProject(project);
  const { state, load } = useLazyLoadableData(initSoul);

  useEffect(() => {
    if (state.type === 'loaded') {
      onInitiated();
    }
  }, [state.type, onInitiated]);

  const handleInit = () => {
    load(project.id);
  };

  switch (state.type) {
    case 'not_requested':
    case 'error':
      return (
        <Card className="flex flex-col gap-3 p-4">
          <ReasonBanner reason={reason} />

          {state.type === 'error' && (
            <p className="text-destructive text-sm">
              Failed to initialize. Please try again.
            </p>
          )}

          <div>
            <Button onClick={handleInit}>
              <Sparkles />
              Initialize Soul
            </Button>
          </div>
        </Card>
      );

    case 'loading':
      return (
        <Card className="flex flex-col gap-3 p-4">
          <ReasonBanner reason={reason} />
          <div>
            <Button loading disabled>
              Initializing...
            </Button>
          </div>
        </Card>
      );

    case 'loaded':
      return null;

    default:
      return notReachable(state);
  }
};

const ReasonBanner = ({ reason }: { reason: Reason }) => {
  switch (reason) {
    case 'no_soul':
      return (
        <div className="flex items-start gap-3">
          <Sparkles className="text-muted-foreground mt-0.5 size-5 shrink-0" />
          <div>
            <div className="text-base font-semibold">
              Your project Soul is not initialized yet
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The Soul captures the essence of your project — goals, context,
              and key decisions. Initialize it to unlock planning features.
            </p>
          </div>
        </div>
      );

    case 'error':
      return (
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
          <div>
            <div className="text-base font-semibold">
              Soul initialization failed
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Something went wrong during the previous initialization attempt.
              You can try again.
            </p>
          </div>
        </div>
      );

    default:
      return notReachable(reason);
  }
};
