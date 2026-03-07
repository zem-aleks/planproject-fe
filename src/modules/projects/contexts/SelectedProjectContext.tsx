import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { ProjectsContext } from '@/modules/projects/contexts/ProjectsContext.tsx';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity.ts';
import { noOperation } from '@/utils/notReachable';

type SelectedProjectContextData = {
  project: ProjectPreviewEntity | null;
  select: (project: ProjectPreviewEntity) => void;
  unselect: () => void;
};

const emptyContextValue: SelectedProjectContextData = {
  project: null,
  select: noOperation,
  unselect: noOperation,
};

export const SelectedProjectContext =
  createContext<SelectedProjectContextData>(emptyContextValue);

export const SelectedProjectContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { projects } = useContext(ProjectsContext);
  const [selectedId, setSelectedId] = useState<string | null>(() =>
    localStorage.getItem('selectedProjectId'),
  );

  const project = useMemo(
    () =>
      selectedId ? (projects.find((p) => p.id === selectedId) ?? null) : null,
    [projects, selectedId],
  );

  const select = useCallback((newProject: ProjectPreviewEntity) => {
    localStorage.setItem('selectedProjectId', newProject.id);
    setSelectedId(newProject.id);
  }, []);

  const unselect = useCallback(() => {
    localStorage.removeItem('selectedProjectId');
    setSelectedId(null);
  }, []);

  return (
    <SelectedProjectContext.Provider value={{ project, select, unselect }}>
      {children}
    </SelectedProjectContext.Provider>
  );
};
