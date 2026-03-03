import { Link } from 'react-router';

import { CircleHelp, Layers, Lightbulb, ShieldAlert } from 'lucide-react';

import type { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { BrainstormForm } from '@/modules/soul/components/BrainstormForm';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';

export const SoulActionButtons = ({
  project,
  onSoulChanged,
}: {
  project: ProjectPreviewEntity;
  onSoulChanged: () => void;
}) => {
  const soul = project.soul;
  const oqCount = soul?.openQuestions.length ?? 0;
  const aCount = soul?.assumptions.length ?? 0;
  const wsCount = soul?.workstreams.length ?? 0;
  const dCount = soul?.decisions.length ?? 0;

  return (
    <div className={'flex flex-col gap-2'}>
      <div className="grid grid-cols-5 gap-2">
        <BrainstormForm project={project} onSoulChanged={onSoulChanged} />

        <Button variant={oqCount > 0 ? 'warning' : 'outline'} asChild>
          <Link to={`/project/${project.id}/open-questions`}>
            <CircleHelp className="size-4" />
            Open Questions
            {oqCount > 0 && <Badge variant="secondary">{oqCount}</Badge>}
          </Link>
        </Button>

        <Button variant={aCount > 0 ? 'warning' : 'outline'} asChild>
          <Link to={`/project/${project.id}/assumptions`}>
            <ShieldAlert className="size-4" />
            Assumptions
            {aCount > 0 && <Badge variant="secondary">{aCount}</Badge>}
          </Link>
        </Button>

        <Button variant={'outline'} asChild>
          <Link to={`/project/${project.id}/workstreams`}>
            <Layers className="size-4" />
            Workstreams
            {wsCount > 0 && <Badge variant="secondary">{wsCount}</Badge>}
          </Link>
        </Button>

        <Button variant="success" asChild>
          <Link to={`/project/${project.id}/decisions`}>
            <Lightbulb className="size-4" />
            Decisions
            {dCount > 0 && <Badge variant="secondary">{dCount}</Badge>}
          </Link>
        </Button>
      </div>
    </div>
  );
};
