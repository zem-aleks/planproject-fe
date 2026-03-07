import { useEffect } from 'react';

import type { AxiosError } from 'axios';
import { AlertCircle, Sparkles } from 'lucide-react';

import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { initSoul } from '@/modules/soul/api/initSoul';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { notReachable } from '@/utils/notReachable';
import { useMutation } from '@tanstack/react-query';

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
  const { status, error, mutate } = useMutation<
    Awaited<ReturnType<typeof initSoul>>,
    AxiosError<{ message?: string }>,
    string
  >({
    mutationFn: (projectId) => initSoul(projectId),
  });

  useEffect(() => {
    if (status === 'success') {
      onInitiated();
    }
  }, [status, onInitiated]);

  const handleInit = () => {
    mutate(project.id);
  };

  switch (status) {
    case 'idle':
    case 'error':
      return (
        <Card className="flex flex-col gap-3 p-4">
          <ReasonBanner reason={reason} />

          {status === 'error' && (
            <p className="text-destructive text-sm">
              {error?.response?.data?.message ||
                error?.message ||
                'Failed to initialize. Please try again.'}
            </p>
          )}

          <div>
            <Button onClick={handleInit}>
              <Sparkles />
              Initialize Project Profile
            </Button>
          </div>
        </Card>
      );

    case 'pending':
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

    case 'success':
      return null;

    default:
      return notReachable(status);
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
              Your Project Profile is not initialized yet
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The Project Profile captures the essence of your project — goals,
              context, and key decisions. Initialize it to unlock planning
              features.
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
              Project Profile initialization failed
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
