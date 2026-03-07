import { type FormEvent, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Check, Send, Sparkles, Trash2, Undo2 } from 'lucide-react';
import { toast } from 'sonner';

import { queryKeys } from '@/lib/queryKeys';
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
import { DiscoverButton } from '@/modules/soul/components/DiscoverButton';
import { ActiveProjectGuard } from '@/modules/subscriptions/guards/ActiveProjectGuard';
import { PageTemplate } from '@/modules/templates/components/PageTemplate';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/ui/accordion';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { cn } from '@/ui/lib/utils';
import { Separator } from '@/ui/separator';
import { useQueryClient } from '@tanstack/react-query';

export const OpenQuestionsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return <ProjectNotFound />;
  }

  return (
    <ActiveProjectGuard>
      <ProjectPageLoader projectId={projectId}>
        {({ project }) => <OpenQuestionsContent project={project} />}
      </ProjectPageLoader>
    </ActiveProjectGuard>
  );
};

const OpenQuestionsContent = ({
  project,
}: {
  project: ProjectPreviewEntity;
}) => {
  const soul = project.soul;
  const navigate = useNavigate();
  const [creatingChat, setCreatingChat] = useState(false);

  const handleReviewQuestions = async () => {
    setCreatingChat(true);
    try {
      const chat = await createChat(project.id);
      navigate(
        `/project/${project.id}/chat/${chat.id}?message=${encodeURIComponent('Review the project and check if there are any open questions that should be raised or discussed. If you find any, please create a proposal.')}`,
      );
    } catch {
      toast.error('Failed to create chat');
      setCreatingChat(false);
    }
  };

  return (
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
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0">
            <h1 className="text-2xl font-semibold text-white">
              Open Questions
            </h1>
            <div className="text-gray-200">
              Review and resolve open questions for your project
            </div>
          </div>
          <DiscoverButton projectId={project.id} contextType="open_question" />
        </div>

        {soul && soul.openQuestions.length > 0 ? (
          <OpenQuestionsList
            soul={soul}
            soulQueue={project.soulQueue}
            projectId={project.id}
          />
        ) : (
          <Card className="flex flex-col items-center gap-3 p-8 text-center">
            <p className="text-muted-foreground text-sm">
              No open questions yet
            </p>
            <Button
              size="sm"
              loading={creatingChat}
              disabled={creatingChat}
              onClick={handleReviewQuestions}
            >
              <Sparkles className="size-3.5" />
              Check for new questions
            </Button>
          </Card>
        )}
      </div>
    </PageTemplate>
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
}: {
  soul: ProjectSoul;
  soulQueue: SoulOperation[];
  projectId: string;
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  const [undoingId, setUndoingId] = useState<string | null>(null);
  const [loadingChat, setLoadingChat] = useState<string | null>(null);
  const [answeringOption, setAnsweringOption] = useState<string | null>(null);

  const invalidateProject = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.projects.detail(projectId),
    });
  };

  const handleRemove = async (questionIndex: number, topic: string) => {
    setRemovingIndex(questionIndex);
    try {
      await addToSoulQueue(projectId, {
        type: 'remove_open_question',
        topic,
      });
      invalidateProject();
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
      invalidateProject();
    } catch {
      toast.error('Failed to undo');
    } finally {
      setUndoingId(null);
    }
  };

  const handleAnswer = async (topic: string, chosenOption: string) => {
    const key = `${topic}:${chosenOption}`;
    setAnsweringOption(key);
    try {
      await addToSoulQueue(projectId, {
        type: 'answer_open_question',
        topic,
        chosenOption,
      });
      invalidateProject();
    } catch {
      toast.error('Failed to queue answer');
    } finally {
      setAnsweringOption(null);
    }
  };

  const startChatWithMessage = async (topic: string, message: string) => {
    const key = `${topic}:${message}`;
    setLoadingChat(key);
    try {
      const chat = await createChat(projectId, {
        type: 'open_question',
        entityId: topic,
        label: topic,
      });
      navigate(
        `/project/${projectId}/chat/${chat.id}?message=${encodeURIComponent(message)}`,
      );
    } catch {
      toast.error('Failed to create chat');
      setLoadingChat(null);
    }
  };

  return (
    <Accordion type="single" collapsible className="flex flex-col gap-2">
      {soul.openQuestions.map((q, i) => {
        const queueOp = findQueueOp(soulQueue, q.topic);
        const isLoading = removingIndex === i;

        if (queueOp) {
          return (
            <Card key={i} className="flex flex-col gap-0 p-4">
              <div className="opacity-50">
                <div className="text-sm font-medium">{q.topic}</div>
                {q.context && (
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                    {q.context}
                  </p>
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

        return (
          <Card key={i} className="p-0">
            <AccordionItem value={`q-${i}`} className="border-b-0">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex flex-1 items-center gap-3">
                  <span className="flex-1 text-left">{q.topic}</span>
                  <div
                    className="flex shrink-0 items-center gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
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
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-4 pb-4">
                <div className="flex flex-col gap-3">
                  {/* Context & impact reason */}
                  {(q.context || q.impactReason) && (
                    <div className="flex flex-col gap-1">
                      {q.context && (
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          {q.context}
                        </p>
                      )}
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {q.impactReason}
                      </p>
                    </div>
                  )}

                  {/* Suggested options — selecting queues an answer */}
                  {q.suggestedOptions && q.suggestedOptions.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <p className="text-muted-foreground text-xs font-medium">
                        Suggested answers — click to accept:
                      </p>
                      <div className="flex flex-col gap-1">
                        {q.suggestedOptions.map((opt, j) => {
                          const optKey = `${q.topic}:${opt}`;
                          return (
                            <button
                              key={j}
                              type="button"
                              disabled={isLoading || answeringOption === optKey}
                              onClick={() => handleAnswer(q.topic, opt)}
                              className={cn(
                                'border-border hover:border-primary/40 hover:bg-muted flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                                answeringOption === optKey && 'opacity-50',
                              )}
                            >
                              <Check className="text-muted-foreground size-3.5 shrink-0" />
                              <span className="flex-1">{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Custom message input */}
                  <CustomChatInput
                    disabled={!!loadingChat || isLoading}
                    onSubmit={(message) =>
                      startChatWithMessage(q.topic, message)
                    }
                  />

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      disabled={isLoading}
                      loading={removingIndex === i}
                      onClick={() => handleRemove(i, q.topic)}
                    >
                      <Trash2 className="size-3.5" />
                      Remove
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Card>
        );
      })}
    </Accordion>
  );
};

const CustomChatInput = ({
  disabled,
  onSubmit,
}: {
  disabled: boolean;
  onSubmit: (message: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = inputRef.current?.value.trim();
    if (!value) return;
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="text"
        placeholder="Type your own answer or question..."
        disabled={disabled}
        className="border-border bg-background placeholder:text-muted-foreground focus:border-primary/40 flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
      />
      <Button type="submit" variant="outline" size="sm" disabled={disabled}>
        <Send className="size-3.5" />
      </Button>
    </form>
  );
};
