import { Link } from 'react-router';

import { Map } from 'lucide-react';

import { FocusMilestoneCard } from '@/modules/milestones/components/FocusMilestoneCard';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { ShapingComment } from '@/modules/shaping/components/ShapingComment';
import { ActiveTaskCard } from '@/modules/tasks/components/ActiveTaskCard';
import { TaskDetailsEntity } from '@/modules/tasks/types/entity';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';
import { TodayTimelineLoader } from '@/modules/timeline/components/TodayTimelineLoader';
import { Button } from '@/ui/button';
import { DaysCounter } from '@/ui/custom/DaysCounter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { notReachable } from '@/utils/notReachable';

export const FocusPage = () => {
  const { project } = useProjectByUrlParam();
  if (!project) {
    return <ProjectNotFound />;
  }

  return (
    <PageTemplate
      header={{
        breadcrumbs: [
          { title: 'Projects', href: '/projects' },
          { title: project.title, href: `/project/${project.id}` },
        ],
        title: `Focus Space`,
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className={'flex flex-row gap-8'}>
          <div className="flex grow flex-col gap-0">
            <h1
              className={
                'flex items-center justify-between gap-2 text-2xl font-semibold text-white'
              }
            >
              Focus Space
            </h1>
            <div className={'text-gray-200'}>
              Suggested items to be accomplished today. Try to focus on one
              thing at a time and step by step your project will be done.
            </div>
          </div>
          <DaysCounter
            startedAt={project.startedAt}
            daysCount={project.daysNeeded}
          />
        </div>

        <TodayTimelineLoader projectId={project.id}>
          {(timelinePoint) => {
            if (!timelinePoint) {
              return (
                <div className={'flex flex-col gap-2 text-gray-200'}>
                  There no active tasks. Please review the phases and activate
                  some of them to generate new tasks
                  <Button asChild={true}>
                    <Link to={`/project/${project.id}/roadmap`}>
                      <Map />
                      Roadmap
                    </Link>
                  </Button>
                </div>
              );
            }

            return (
              <div className={'flex flex-col gap-2'}>
                <ShapingComment comment={timelinePoint.comment} />
                {timelinePoint.milestones.map((milestone) => (
                  <FocusMilestoneCard
                    milestone={milestone}
                    onUpdated={() => {}}
                  />
                ))}
                {/*<ActiveTasksList*/}
                {/*  tasks={timelinePoint.tasks}*/}
                {/*  project={project}*/}
                {/*  onChange={() => {}}*/}
                {/*/>*/}
              </div>
            );
          }}
        </TodayTimelineLoader>
      </div>
    </PageTemplate>
  );
};

export const ActiveTasksList = ({
  // project,
  tasks,
  onChange,
}: {
  project: ProjectEntity;
  tasks: TaskDetailsEntity[];
  onChange: () => void;
}) => {
  const tasksByDay = tasks.reduce(
    (acc, task) => {
      if (!acc[task.day]) {
        acc[task.day] = [];
      }
      acc[task.day].push(task);
      return acc;
    },
    {} as Record<number, TaskDetailsEntity[]>,
  );

  if (tasks.length === 0) {
    return (
      <div className={'flex flex-col items-center gap-2 py-4'}>
        <p className={'text-xl'}>No active tasks</p>
        <p className={'text-muted-foreground pb-2'}>
          All tasks are completed or the project is in draft status.
        </p>
      </div>
    );
  }

  return (
    <Tabs defaultValue={`day-${Object.keys(tasksByDay)[0]}`} className="w-full">
      <TabsList>
        {Object.keys(tasksByDay).map((day) => (
          <TabsTrigger value={`day-${day}`} className={'px-4 py-2 text-lg'}>
            Day {day}
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.entries(tasksByDay).map(([day, tasks]) => (
        <TabsContent value={`day-${day}`} className={''}>
          {/*<div className={'grid grid-cols-1 gap-4 md:grid-cols-2'}>*/}
          {tasks.map((task) => (
            <ActiveTaskCard
              task={task}
              key={task.id}
              onMsg={(msg) => {
                switch (msg.type) {
                  case 'onTaskUpdated':
                    onChange();
                    break;

                  default:
                    return notReachable(msg.type);
                }
              }}
            />
          ))}
          {/*</div>*/}
        </TabsContent>
      ))}
    </Tabs>
  );
};
