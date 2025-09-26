import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage.tsx';
import { ProjectCreatePage } from '@/modules/projects/pages/ProjectCreatePage.tsx';
import { ProjectEditPage } from '@/modules/projects/pages/ProjectEditPage.tsx';
import { ProjectsPage } from '@/modules/projects/pages/ProjectsPage.tsx';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/projects" />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="projects/create" element={<ProjectCreatePage />} />
        <Route
          path="projects/edit/:assistantId"
          element={<ProjectEditPage />}
        />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
};
