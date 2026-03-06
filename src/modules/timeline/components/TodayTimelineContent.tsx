import { useEffect, useState } from 'react';

import { X } from 'lucide-react';
import { toast } from 'sonner';

import { queryKeys } from '@/lib/queryKeys';
import { toggleFocusMilestone } from '@/modules/milestones/api/focusMilestone';
import { FocusMilestoneCard } from '@/modules/milestones/components/FocusMilestoneCard';
import type { MilestoneDetailsEntity } from '@/modules/milestones/types/entity';
import type { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { StartNewMilestoneForm } from '@/modules/timeline/components/StartNewMilestoneForm';
import { Card } from '@/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { IconCheck } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';

type Msg =
  | { type: 'onMilestoneCompleted' }
  | { type: 'onNewMilestoneActivated' };

export const TodayTimelineContent = ({
  milestones,
  project,
  onMsg,
}: {
  milestones: MilestoneDetailsEntity[];
  project: ProjectPreviewEntity;
  onMsg: (msg: Msg) => void;
}) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(milestones[0]?.id ?? '');

  useEffect(() => {
    if (milestones.length > 0 && !milestones.some((m) => m.id === activeTab)) {
      setActiveTab(milestones[0].id);
    }
  }, [milestones, activeTab]);

  if (milestones.length === 0) {
    return (
      <Card className={'flex flex-col items-center gap-6'}>
        <div className={'flex flex-col items-center'}>
          <IconCheck className={'size-20 text-green-600'} />
          <div className={'mb-4 px-2 text-center text-lg'}>
            Well done! All tasks are finished for today!
          </div>
          <StartNewMilestoneForm
            onUpdate={() => onMsg({ type: 'onNewMilestoneActivated' })}
            project={project}
          />
        </div>
      </Card>
    );
  }

  const handleUnfocus = async (e: React.MouseEvent, milestoneId: string) => {
    e.stopPropagation();
    try {
      await toggleFocusMilestone(milestoneId);
      queryClient.invalidateQueries({
        queryKey: queryKeys.timeline.today(project.id),
      });
    } catch {
      toast.error('Failed to remove from focus');
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      {milestones.length > 1 && (
        <TabsList className="h-auto w-full">
          {milestones.map((m) => {
            const completed = m.steps.filter((s) => s.completed).length;
            return (
              <TabsTrigger
                key={m.id}
                value={m.id}
                className="group min-w-0 cursor-pointer gap-2 px-3 py-2"
              >
                <div className="flex min-w-0 flex-col items-start gap-0.5">
                  <span className="w-full truncate text-sm">{m.title}</span>
                  <span className="text-muted-foreground text-[10px]">
                    {completed}/{m.steps.length} steps
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleUnfocus(e, m.id)}
                  className="text-muted-foreground hover:text-destructive -mr-1 cursor-pointer rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="size-4" />
                </button>
              </TabsTrigger>
            );
          })}
        </TabsList>
      )}

      {milestones.map((milestone) => (
        <TabsContent key={milestone.id} value={milestone.id}>
          <FocusMilestoneCard
            milestone={milestone}
            onUpdated={() => onMsg({ type: 'onMilestoneCompleted' })}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};
