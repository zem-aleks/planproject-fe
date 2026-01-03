import { useEffect } from 'react';

import { generateProjectLogo } from '@/modules/projects/api/generateProjectLogo';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { Skeleton } from '@/ui/skeleton';
import { notReachable } from '@/utils/notReachable';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData';

type Msg = { type: 'onProjectUpdated'; project: ProjectEntity };

export const ProjectLogoBuilder = ({
  project,
  onMsg,
}: {
  project: ProjectEntity;
  onMsg: (msg: Msg) => void;
}) => {
  const { state, load } = useLazyLoadableData(generateProjectLogo);

  console.log(state);

  useEffect(() => {
    if (project.logoUrl) {
      return;
    }

    switch (state.type) {
      case 'not_requested':
        load(project.id);
        break;

      case 'loading':
      case 'error':
        break;

      case 'loaded':
        return onMsg({ type: 'onProjectUpdated', project: state.data });

      default:
        return notReachable(state);
    }
  }, [state, project]);

  switch (state.type) {
    case 'loading':
      return (
        <Skeleton className="size-[128px] shrink-0 rounded-md bg-blue-100" />
      );

    case 'error':
    case 'not_requested':
      if (!project.logoUrl || project.logoUrl === 'loading') {
        return (
          <Skeleton className="size-[128px] shrink-0 rounded-md bg-blue-100" />
        );
      }

      return (
        <div className={`size-[128px] shrink-0 rounded-md bg-white`}>
          <img
            src={project.logoUrl}
            alt="Project Logo"
            className="h-full w-full rounded-md object-contain object-center"
          />
        </div>
      );

    case 'loaded':
      return (
        <div className={`size-[128px] shrink-0 rounded-md bg-white`}>
          <img
            src={state.data.logoUrl || ''}
            alt="Project Logo"
            className="h-full w-full rounded-md object-contain object-center"
          />
        </div>
      );

    default:
      return notReachable(state);
  }
};
