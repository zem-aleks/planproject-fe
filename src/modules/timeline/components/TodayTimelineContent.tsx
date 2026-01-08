import { Link } from 'react-router';

import { Map } from 'lucide-react';

import { FocusCompletedMilestoneCard } from '@/modules/milestones/components/FocusCompletedMilestoneCard';
import { FocusMilestoneCard } from '@/modules/milestones/components/FocusMilestoneCard';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { ShapingComment } from '@/modules/shaping/components/ShapingComment';
import { StartNewMilestoneForm } from '@/modules/timeline/components/StartNewMilestoneForm';
import { TimelinePointEntity } from '@/modules/timeline/types/entity';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { IconCheck } from '@tabler/icons-react';

type Msg =
  | { type: 'onMilestoneCompleted' }
  | { type: 'onNewMilestoneActivated' };

export const TodayTimelineContent = ({
  timelinePoint,
  project,
  onMsg,
}: {
  timelinePoint: TimelinePointEntity | null;
  project: ProjectEntity;
  onMsg: (msg: Msg) => void;
}) => {
  if (!timelinePoint) {
    return (
      <div className={'flex flex-col gap-2 text-gray-200'}>
        There no active tasks. Please review the phases and activate some of
        them to generate new tasks
        <Button asChild={true}>
          <Link to={`/project/${project.id}/roadmap`}>
            <Map />
            Roadmap
          </Link>
        </Button>
      </div>
    );
  }

  const allMilestonesFinished = timelinePoint.milestones.every(
    (m) => m.status === 'completed',
  );

  if (allMilestonesFinished) {
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
        <div className={'text-gray-200'}>
          {timelinePoint.milestones.map((milestone) => (
            <FocusCompletedMilestoneCard milestone={milestone} />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className={'flex flex-col gap-2'}>
      <ShapingComment comment={timelinePoint.comment} />
      {timelinePoint.milestones.map((milestone) => {
        if (milestone.status === 'completed') {
          return <FocusCompletedMilestoneCard milestone={milestone} />;
        }

        return (
          <FocusMilestoneCard
            milestone={milestone}
            onUpdated={() => onMsg({ type: 'onMilestoneCompleted' })}
          />
        );
      })}
      {/*<ActiveTasksList*/}
      {/*  tasks={timelinePoint.tasks}*/}
      {/*  project={project}*/}
      {/*  onChange={() => {}}*/}
      {/*/>*/}
    </div>
  );
};
