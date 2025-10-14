import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { ActiveTaskCard } from '@/modules/tasks/components/ActiveTaskCard';
import { ActiveTasksLoader } from '@/modules/tasks/components/ActiveTasksLoader';
import { TaskDetailsEntity } from '@/modules/tasks/types/entity';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';

export const TasksPage = () => {
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
        title: `Tasks`,
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className={'flex flex-row gap-8'}>
          <div className="flex grow flex-col gap-0">
            <h1
              className={
                'flex items-center justify-between gap-2 text-2xl font-semibold'
              }
            >
              Tasks
            </h1>
            <div className={'text-muted-foreground'}>
              List of all active tasks
            </div>
          </div>
        </div>

        <ActiveTasksLoader projectId={project.id}>
          {(tasks) => <ActiveTasksList tasks={tasks} project={project} />}
        </ActiveTasksLoader>
      </div>
    </PageTemplate>
  );
};

export const ActiveTasksList = ({
  // project,
  tasks,
}: {
  project: ProjectEntity;
  tasks: TaskDetailsEntity[];
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
            <ActiveTaskCard task={task} key={task.id} />
          ))}
          {/*</div>*/}
        </TabsContent>
      ))}
    </Tabs>
  );
};
