import { FocusMilestoneCard } from '@/modules/milestones/components/FocusMilestoneCard';
import { MilestoneDetailsEntity } from '@/modules/milestones/types/entity';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { FocusComment } from '@/modules/timeline/components/FocusComment';
import { StartNewMilestoneForm } from '@/modules/timeline/components/StartNewMilestoneForm';
import { Card } from '@/ui/card';
import { IconCheck } from '@tabler/icons-react';

type Msg =
  | { type: 'onMilestoneCompleted' }
  | { type: 'onNewMilestoneActivated' };

export const TodayTimelineContent = ({
  milestone,
  project,
  onMsg,
}: {
  milestone: MilestoneDetailsEntity | null;
  project: ProjectEntity;
  onMsg: (msg: Msg) => void;
}) => {
  if (!milestone || milestone.status === 'completed') {
    return (
      <Card className={'flex flex-col items-center gap-6'}>
        <div className={'flex flex-col items-center'}>
          <IconCheck className={'size-20 text-green-600'} />
          <div className={'mb-4 px-2 text-lg'}>
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

  return (
    <div className={'flex flex-col gap-2'}>
      <FocusComment projectId={project.id} />
      <FocusMilestoneCard
        milestone={milestone}
        onUpdated={() => onMsg({ type: 'onMilestoneCompleted' })}
      />
    </div>
  );
};
