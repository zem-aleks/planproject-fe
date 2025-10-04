import { BrowserRouter, Route, Routes } from 'react-router';

import { LoginPage } from '@/modules/auth/pages/LoginPage';
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage';
import { HomePage } from '@/modules/home/pages/HomePage';
import { PhaseViewPage } from '@/modules/phases/pages/PhaseViewPage';
import { ProjectCreatePage } from '@/modules/projects/pages/ProjectCreatePage.tsx';
import { ProjectEditPage } from '@/modules/projects/pages/ProjectEditPage.tsx';
import { ProjectsPage } from '@/modules/projects/pages/ProjectsPage.tsx';
import { InternalElement } from '@/routing/components/InternalElement';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/projects"
          element={
            <InternalElement>
              <ProjectsPage />
            </InternalElement>
          }
        />
        <Route
          path="/projects/create"
          element={
            <InternalElement>
              <ProjectCreatePage />
            </InternalElement>
          }
        />
        <Route
          path="/projects/edit/:projectId"
          element={
            <InternalElement>
              <ProjectEditPage />
            </InternalElement>
          }
        />
        <Route
          path="/project/:projectId"
          element={
            <InternalElement>
              <DashboardPage />
            </InternalElement>
          }
        />
        <Route
          path="/project/:projectId/phase/:phaseId"
          element={
            <InternalElement>
              <PhaseViewPage />
            </InternalElement>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
