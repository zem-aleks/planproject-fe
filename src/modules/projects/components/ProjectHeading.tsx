import { ProjectLogoBuilder } from '@/modules/projects/components/ProjectLogoBuilder';
import { ProjectStatusBadge } from '@/modules/projects/components/ProjectStatus';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';

export const ProjectHeading = ({
  project,
}: {
  project: ProjectPreviewEntity;
}) => {
  return (
    <div className={'flex flex-col-reverse gap-2 sm:flex-row sm:gap-8'}>
      <div className="flex grow flex-col gap-1">
        <h1
          className={
            'flex flex-col justify-between gap-2 text-2xl font-semibold text-gray-100 sm:flex-row sm:items-center'
          }
        >
          {project.soul?.name ?? project.title}
          <ProjectStatusBadge status={project.status} />
        </h1>
        <p className={'text-gray-300'}>
          {project.soul?.summary ||
            project.description ||
            'No description available'}
        </p>
      </div>
      <div className={'flex flex-col gap-2'}>
        <ProjectLogoBuilder project={project} />
      </div>
    </div>
  );
};
