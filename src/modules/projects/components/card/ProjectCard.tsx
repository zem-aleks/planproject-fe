import { ReactNode } from 'react';

import { ProjectLogo } from '@/modules/projects/components/ProjectLogo';
import { ProjectProgressCard } from '@/modules/projects/components/ProjectProgressCard';
import { ProjectStatusBadge } from '@/modules/projects/components/ProjectStatus';
import {
  ProjectMenuActions,
  Msg as ProjectMenuActionsMsg,
} from '@/modules/projects/components/card/ProjectMenuActions.tsx';
import { ProjectEntity } from '@/modules/projects/types/entity';
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/ui/card.tsx';
import { notReachable } from '@/utils/notReachable';

export type Msg = ProjectMenuActionsMsg;

type Props = {
  project: ProjectEntity;
  onMsg: (msg: Msg) => void;
};

export const ProjectCard = ({ project, onMsg }: Props): ReactNode => {
  switch (project.status) {
    case 'draft':
      return (
        <Card
          className="@container/card cursor-pointer gap-4 bg-white py-6 transition-shadow hover:shadow-lg"
          tabIndex={0}
          aria-role="button"
          onClick={() => onMsg({ type: 'onProjectSelect', project })}
        >
          <CardHeader>
            <div className={'flex gap-4 pr-2'}>
              <ProjectLogo url={project.logoUrl} size={'medium'} />
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {project.title}
                  <ProjectStatusBadge status={project.status} />
                </CardTitle>
                <div>
                  Finish this project description to get it's plan and insights
                </div>
              </div>
            </div>
            <CardAction>
              <ProjectMenuActions project={project} onMsg={onMsg} />
            </CardAction>
          </CardHeader>
          <CardFooter className="w-full flex-row items-start justify-between"></CardFooter>
        </Card>
      );

    case 'shaping':
    case 'analyzing':
    case 'active':
    case 'completed':
    case 'onHold':
    case 'cancelled':
      return (
        <Card
          className="@container/card cursor-pointer gap-4 bg-white py-6 transition-shadow hover:shadow-lg"
          tabIndex={0}
          aria-role="button"
          onClick={() => onMsg({ type: 'onProjectSelect', project })}
        >
          <CardHeader>
            <div className={'flex gap-4 pr-2'}>
              <div>
                <ProjectLogo url={project.logoUrl} size={'medium'} />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {project.title}
                  <ProjectStatusBadge status={project.status} />
                </CardTitle>
                <div>{project.description}</div>
              </div>
            </div>
            <CardAction>
              <ProjectMenuActions project={project} onMsg={onMsg} />
            </CardAction>
          </CardHeader>
          <CardFooter className="w-full flex-row items-start justify-between gap-4">
            <div className={'grow'}>
              <ProjectProgressCard project={project} />
            </div>
          </CardFooter>
        </Card>
      );

    default:
      return notReachable(project.status);
  }
};
