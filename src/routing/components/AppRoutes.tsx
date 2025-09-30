import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import { PhaseViewPage } from '@/modules/phases/pages/PhaseViewPage';
import { ProjectCreatePage } from '@/modules/projects/pages/ProjectCreatePage.tsx';
import { ProjectEditPage } from '@/modules/projects/pages/ProjectEditPage.tsx';
import { ProjectViewPage } from '@/modules/projects/pages/ProjectViewPage';
import { ProjectsPage } from '@/modules/projects/pages/ProjectsPage.tsx';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/projects" />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/create" element={<ProjectCreatePage />} />
        <Route path="/projects/edit/:projectId" element={<ProjectEditPage />} />
        <Route path="/project/:projectId" element={<ProjectViewPage />} />
        <Route
          path="/project/:projectId/phase/:phaseId"
          element={<PhaseViewPage />}
        />
      </Routes>
    </BrowserRouter>
  );
};
