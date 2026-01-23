import { BrowserRouter, Route, Routes } from 'react-router';

import { AuditoryPage } from '@/modules/auditory/pages/AuditoryPage';
import { AuthCallbackPage } from '@/modules/auth/pages/AuthCallbackPage';
import { LoginPage } from '@/modules/auth/pages/LoginPage';
import { CompetitorsPage } from '@/modules/competitors/pages/CompetitorsPage';
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage';
import { RoadmapPage } from '@/modules/dashboard/pages/RoadmapPage';
import { privacyPolicyContent } from '@/modules/home/data/privacy';
import { termsOfUseContent } from '@/modules/home/data/terms';
import { HomePage } from '@/modules/home/pages/HomePage';
import { PricingPage } from '@/modules/home/pages/PricingPage';
import { StaticPage } from '@/modules/home/pages/StaticPage';
import { FocusPage } from '@/modules/milestones/pages/FocusPage';
import { MilestonePage } from '@/modules/milestones/pages/MilestonePage';
import { PhaseViewPage } from '@/modules/phases/pages/PhaseViewPage';
import { ProjectCreatePage } from '@/modules/projects/pages/ProjectCreatePage.tsx';
import { ProjectEditPage } from '@/modules/projects/pages/ProjectEditPage.tsx';
import { ProjectsPage } from '@/modules/projects/pages/ProjectsPage.tsx';
import { CheckoutSuccessPage } from '@/modules/subscriptions/pages/CheckoutSuccessPage';
import { TimelinePage } from '@/modules/timeline/pages/TimelinePage';
import { AccountPage } from '@/modules/users/pages/AccountPage';
import { InternalElement } from '@/routing/components/InternalElement';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route
          path="/p/terms"
          element={<StaticPage content={termsOfUseContent} />}
        />
        <Route
          path="/p/privacy-policy"
          element={<StaticPage content={privacyPolicyContent} />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        <Route
          path="/account"
          element={
            <InternalElement>
              <AccountPage />
            </InternalElement>
          }
        />

        <Route
          path="/checkout/session-success"
          element={
            <InternalElement>
              <CheckoutSuccessPage />
            </InternalElement>
          }
        />

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
        <Route
          path="/project/:projectId/focus"
          element={
            <InternalElement>
              <FocusPage />
            </InternalElement>
          }
        />

        <Route
          path="/project/:projectId/timeline"
          element={
            <InternalElement>
              <TimelinePage />
            </InternalElement>
          }
        />

        <Route
          path="/project/:projectId/competitors"
          element={
            <InternalElement>
              <CompetitorsPage />
            </InternalElement>
          }
        />

        <Route
          path="/project/:projectId/auditory"
          element={
            <InternalElement>
              <AuditoryPage />
            </InternalElement>
          }
        />

        <Route
          path="/project/:projectId/roadmap"
          element={
            <InternalElement>
              <RoadmapPage />
            </InternalElement>
          }
        />

        <Route
          path="/project/:projectId/milestone/:milestoneId"
          element={
            <InternalElement>
              <MilestonePage />
            </InternalElement>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
