import { ReactNode } from 'react';

import { ProjectLogo } from '@/modules/projects/components/ProjectLogo';
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

export type Msg = ProjectMenuActionsMsg;

type Props = {
  project: ProjectEntity;
  onMsg: (msg: Msg) => void;
};

export const ProjectCard = ({ project, onMsg }: Props): ReactNode => {
  return (
    <Card
      className="@container/card cursor-pointer gap-4 bg-gradient-to-b py-6 transition-shadow hover:shadow-lg"
      tabIndex={0}
      aria-role="button"
      onClick={() => onMsg({ type: 'onProjectSelect', project })}
    >
      <CardHeader>
        <div className={'flex gap-4 pr-2'}>
          <ProjectLogo url={project.logoUrl} size={'medium'} />
          <div>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {project.title}
            </CardTitle>
            <div className={'text-muted-foreground'}>
              {(project.description || '').slice(0, 140)}...
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
};
