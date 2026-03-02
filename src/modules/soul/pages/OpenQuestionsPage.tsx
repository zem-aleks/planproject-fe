import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Check, MessageCircle, Undo2, X } from 'lucide-react';
import { toast } from 'sonner';

import { createChat } from '@/modules/chat/api/createChat';
import { ProjectPageLoader } from '@/modules/projects/components/ProjectPageLoader';
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

export const OpenQuestionsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return <ProjectNotFound />;
  }

  return (
    <ActiveProjectGuard>
      <ProjectPageLoader projectId={projectId}>
        {({ project, reload }) => (
          <OpenQuestionsContent project={project} onChanged={reload} />
        )}
      </ProjectPageLoader>
    </ActiveProjectGuard>
  );
};

const OpenQuestionsContent = ({
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
          title: 'Open Questions',
        }}
      >
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex flex-col gap-0">
            <h1 className="text-2xl font-semibold text-white">
              Open Questions
            </h1>
            <div className="text-gray-200">
              Review and resolve open questions for your project
            </div>
          </div>

          {soul && soul.openQuestions.length > 0 ? (
            <OpenQuestionsList
              soul={soul}
              soulQueue={project.soulQueue}
              projectId={project.id}
              onProjectChanged={onChanged}
            />
          ) : (
            <Card className="p-5">
              <p className="text-muted-foreground text-sm">No open questions</p>
            </Card>
          )}
        </div>
      </PageTemplate>
      <SoulQueueSnackbar project={project} onProjectChanged={onChanged} />
    </>
  );
};

const ImpactBadge = ({
  impact,
}: {
  impact: 'blocking' | 'important' | 'minor';
}) => {
  switch (impact) {
    case 'blocking':
      return <Badge variant="destructive">blocking</Badge>;
    case 'important':
      return <Badge variant="warning">important</Badge>;
    case 'minor':
      return <Badge variant="secondary">minor</Badge>;
  }
};

const findQueueOp = (soulQueue: SoulOperation[], topic: string) =>
  soulQueue.find(
    (op) =>
      (op.type === 'answer_open_question' ||
        op.type === 'remove_open_question') &&
      op.topic === topic,
  );

const PendingActionLabel = ({ op }: { op: SoulOperation }) => {
  switch (op.type) {
    case 'answer_open_question':
      return (
        <span>
          Will be answered with: <strong>{op.chosenOption}</strong>
        </span>
      );
    case 'remove_open_question':
      return <span>Will be removed</span>;
    default:
      return null;
  }
};

const OpenQuestionsList = ({
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
  const navigate = useNavigate();
  const [selections, setSelections] = useState<Record<number, string>>({});
  const [answeringIndex, setAnsweringIndex] = useState<number | null>(null);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  const [undoingId, setUndoingId] = useState<string | null>(null);
  const [chattingIndex, setChattingIndex] = useState<number | null>(null);

  const toggleSelection = (questionIndex: number, option: string) => {
    setSelections((prev) => ({
      ...prev,
      [questionIndex]: prev[questionIndex] === option ? undefined! : option,
    }));
  };

  const handleAnswer = async (questionIndex: number, topic: string) => {
    const chosenOption = selections[questionIndex];
    if (!chosenOption) return;

    setAnsweringIndex(questionIndex);
    try {
      await addToSoulQueue(projectId, {
        type: 'answer_open_question',
        topic,
        chosenOption,
      });
      onProjectChanged();
    } catch {
      toast.error('Failed to submit answer');
    } finally {
      setAnsweringIndex(null);
    }
  };

  const handleRemove = async (questionIndex: number, topic: string) => {
    setRemovingIndex(questionIndex);
    try {
      await addToSoulQueue(projectId, {
        type: 'remove_open_question',
        topic,
      });
      onProjectChanged();
    } catch {
      toast.error('Failed to remove question');
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

  const handleStartChat = async (index: number, topic: string) => {
    setChattingIndex(index);
    try {
      const chat = await createChat(projectId, {
        type: 'open_question',
        entityId: topic,
        label: topic,
      });
      navigate(`/project/${projectId}/chat/${chat.id}`);
    } catch {
      toast.error('Failed to create chat');
      setChattingIndex(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {soul.openQuestions.map((q, i) => {
        const queueOp = findQueueOp(soulQueue, q.topic);

        if (queueOp) {
          return (
            <Card key={i} className="flex flex-col gap-0 p-4">
              <div className="flex items-start justify-between gap-3 opacity-50">
                <div className="flex-1">
                  <div className="text-sm font-medium">{q.topic}</div>
                  {q.context && (
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                      {q.context}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <ImpactBadge impact={q.impact} />
                </div>
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

        const isLoading = answeringIndex === i || removingIndex === i;

        return (
          <Card key={i} className="flex flex-col gap-0 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="text-sm font-medium">{q.topic}</div>
                {q.context && (
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                    {q.context}
                  </p>
                )}
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                  {q.impactReason}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <ImpactBadge impact={q.impact} />
                <Badge
                  variant={
                    q.status === 'discussed_unresolved'
                      ? 'warning'
                      : 'secondary'
                  }
                >
                  {q.status === 'discussed_unresolved'
                    ? 'unresolved'
                    : 'not discussed'}
                </Badge>
                <Button
                  variant="outline"
                  className="border-red-700"
                  size="sm"
                  disabled={isLoading}
                  loading={removingIndex === i}
                  onClick={() => handleRemove(i, q.topic)}
                >
                  <X className="size-3.5" />
                  Remove
                </Button>
              </div>
            </div>

            {q.suggestedOptions && q.suggestedOptions.length > 0 && (
              <div className="mt-3 flex flex-col gap-1.5">
                <p className="text-muted-foreground text-xs font-medium">
                  Pick an answer:
                </p>
                <div className="flex flex-col gap-1">
                  {q.suggestedOptions.map((opt, j) => {
                    const isSelected = selections[i] === opt;
                    return (
                      <button
                        key={j}
                        type="button"
                        disabled={isLoading}
                        onClick={() => toggleSelection(i, opt)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary font-medium'
                            : 'border-border hover:border-primary/40 hover:bg-muted cursor-pointer'
                        } ${isLoading ? 'opacity-50' : ''}`}
                      >
                        <div
                          className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                            isSelected
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground/40'
                          }`}
                        >
                          {isSelected && (
                            <Check className="size-2.5 text-white" />
                          )}
                        </div>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <Separator className="my-3" />

            <div className="flex gap-2">
              {selections[i] && (
                <Button
                  size="sm"
                  disabled={isLoading}
                  loading={answeringIndex === i}
                  onClick={() => handleAnswer(i, q.topic)}
                >
                  <Check className="size-3.5" />
                  Confirm answer
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading || chattingIndex === i}
                loading={chattingIndex === i}
                onClick={() => handleStartChat(i, q.topic)}
              >
                <MessageCircle className="size-3.5" />
                Start a chat
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
