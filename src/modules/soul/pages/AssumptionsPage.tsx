import { useState } from 'react';
import { useParams } from 'react-router';

import { Check, MessageCircle, Undo2, X } from 'lucide-react';
import { toast } from 'sonner';

import { getProject } from '@/modules/projects/api/getProject';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import type {
  ProjectPreviewEntity,
  ProjectSoul,
  SoulOperation,
} from '@/modules/projects/types/entity';
import { addToSoulQueue } from '@/modules/soul/api/addToSoulQueue';
import { removeFromSoulQueue } from '@/modules/soul/api/removeFromSoulQueue';
import { SoulQueueSnackbar } from '@/modules/soul/components/SoulQueueSnackbar';
import { ActiveProjectGuard } from '@/modules/subscriptions/guards/ActiveProjectGuard';
import { PageTemplate } from '@/modules/templates/components/PageTemplate';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Separator } from '@/ui/separator';
import { Spinner } from '@/ui/spinner';
import { notReachable } from '@/utils/notReachable';
import { useReloadableData } from '@/utils/useReloadableData';

export const AssumptionsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return <ProjectNotFound />;
  }

  return (
    <ActiveProjectGuard>
      <AssumptionsLoader projectId={projectId} />
    </ActiveProjectGuard>
  );
};

const AssumptionsLoader = ({ projectId }: { projectId: string }) => {
  const { state, reload } = useReloadableData(getProject, projectId);

  switch (state.type) {
    case 'loading':
      return (
        <PageTemplate
          header={{
            breadcrumbs: [{ title: 'Projects', href: '/projects' }],
            title: 'Loading…',
          }}
        >
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Card className="flex items-center gap-3 p-5">
              <Spinner className="size-5" />
              <span className="text-muted-foreground text-sm">Loading…</span>
            </Card>
          </div>
        </PageTemplate>
      );

    case 'error':
      return (
        <PageTemplate
          header={{
            breadcrumbs: [{ title: 'Projects', href: '/projects' }],
            title: 'Error',
          }}
        >
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
            <p className="text-muted-foreground text-sm">
              Failed to load project
            </p>
            <Button variant="outline" size="sm" onClick={reload}>
              Try again
            </Button>
          </div>
        </PageTemplate>
      );

    case 'loaded':
    case 'reloading':
      return <AssumptionsContent project={state.data} onChanged={reload} />;

    default:
      return notReachable(state);
  }
};

const AssumptionsContent = ({
  project,
  onChanged,
}: {
  project: ProjectPreviewEntity;
  onChanged: () => void;
}) => {
  const soul = project.soul;

  return (
    <>
      <PageTemplate
        header={{
          breadcrumbs: [
            { title: 'Projects', href: '/projects' },
            { title: project.title, href: `/project/${project.id}` },
          ],
          title: 'Assumptions',
        }}
      >
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex flex-col gap-0">
            <h1 className="text-2xl font-semibold text-white">Assumptions</h1>
            <div className="text-gray-200">
              Review and resolve assumptions made about your project
            </div>
          </div>

          {soul && soul.assumptions.length > 0 ? (
            <AssumptionsList
              soul={soul}
              soulQueue={project.soulQueue}
              projectId={project.id}
              onProjectChanged={onChanged}
            />
          ) : (
            <Card className="p-5">
              <p className="text-muted-foreground text-sm">No assumptions</p>
            </Card>
          )}
        </div>
      </PageTemplate>
      <SoulQueueSnackbar project={project} onProjectChanged={onChanged} />
    </>
  );
};

const findQueueOp = (soulQueue: SoulOperation[], assumption: string) =>
  soulQueue.find(
    (op) =>
      (op.type === 'accept_assumption' || op.type === 'remove_assumption') &&
      op.assumption === assumption,
  );

const PendingActionLabel = ({ op }: { op: SoulOperation }) => {
  switch (op.type) {
    case 'accept_assumption':
      return <span>Will be accepted</span>;
    case 'remove_assumption':
      return <span>Will be rejected</span>;
    default:
      return null;
  }
};

const AssumptionsList = ({
  soul,
  soulQueue,
  projectId,
  onProjectChanged,
}: {
  soul: ProjectSoul;
  soulQueue: SoulOperation[];
  projectId: string;
  onProjectChanged: () => void;
}) => {
  const [acceptingIndex, setAcceptingIndex] = useState<number | null>(null);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  const [undoingId, setUndoingId] = useState<string | null>(null);

  const handleAccept = async (index: number, assumption: string) => {
    setAcceptingIndex(index);
    try {
      await addToSoulQueue(projectId, {
        type: 'accept_assumption',
        assumption,
      });
      onProjectChanged();
    } catch {
      toast.error('Failed to accept assumption');
    } finally {
      setAcceptingIndex(null);
    }
  };

  const handleRemove = async (index: number, assumption: string) => {
    setRemovingIndex(index);
    try {
      await addToSoulQueue(projectId, {
        type: 'remove_assumption',
        assumption,
      });
      onProjectChanged();
    } catch {
      toast.error('Failed to remove assumption');
    } finally {
      setRemovingIndex(null);
    }
  };

  const handleUndo = async (operationId: string) => {
    setUndoingId(operationId);
    try {
      await removeFromSoulQueue(projectId, { operationId });
      onProjectChanged();
    } catch {
      toast.error('Failed to undo');
    } finally {
      setUndoingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {soul.assumptions.map((a, i) => {
        const queueOp = findQueueOp(soulQueue, a.assumption);

        if (queueOp) {
          return (
            <Card key={i} className="flex flex-col gap-0 p-4">
              <div className="opacity-50">
                <div className="text-sm font-medium">{a.assumption}</div>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                  {a.reasoning}
                </p>

                {a.affectedAreas.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {a.affectedAreas.map((area) => (
                      <Badge
                        key={area}
                        variant="secondary"
                        className="text-[10px]"
                      >
                        {area}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Separator className="my-3" />

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="warning">queued</Badge>
                  <span className="text-muted-foreground text-xs">
                    <PendingActionLabel op={queueOp} />
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  loading={undoingId === queueOp.id}
                  disabled={undoingId === queueOp.id}
                  onClick={() => handleUndo(queueOp.id)}
                >
                  <Undo2 className="size-3.5" />
                  Undo
                </Button>
              </div>
            </Card>
          );
        }

        const isLoading = acceptingIndex === i || removingIndex === i;

        return (
          <Card key={i} className="flex flex-col gap-0 p-4">
            <div className="text-sm font-medium">{a.assumption}</div>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              {a.reasoning}
            </p>

            {a.affectedAreas.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {a.affectedAreas.map((area) => (
                  <Badge key={area} variant="secondary" className="text-[10px]">
                    {area}
                  </Badge>
                ))}
              </div>
            )}

            <Separator className="my-3" />

            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                disabled={isLoading}
                loading={acceptingIndex === i}
                onClick={() => handleAccept(i, a.assumption)}
              >
                <Check className="size-3.5" />
                Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading}
                loading={removingIndex === i}
                onClick={() => handleRemove(i, a.assumption)}
              >
                <X className="size-3.5" />
                Reject
              </Button>
              <Button variant="ghost" size="sm" disabled={isLoading}>
                <MessageCircle className="size-3.5" />
                Talk
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
