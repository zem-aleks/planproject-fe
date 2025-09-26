import { ReactNode, createContext } from 'react';

import { ProjectsLoader } from '@/modules/projects/components/ProjectsLoader';
import { ProjectEntity } from '@/modules/projects/types/entity';

type ProjectsContextData = {
  projects: ProjectEntity[];
  reload: () => void;
};

const emptyContextValue: ProjectsContextData = {} as ProjectsContextData;

export const ProjectsContext =
  createContext<ProjectsContextData>(emptyContextValue);

export const ProjectsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <ProjectsLoader>
      {(projects, reload) => (
        <ProjectsContext.Provider value={{ projects, reload }}>
          {children}
        </ProjectsContext.Provider>
      )}
    </ProjectsLoader>
  );
};
