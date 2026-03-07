import { BrowserRouter, Route, Routes } from 'react-router';

import { AnalyticsTracker } from '@/modules/analytics/components/AnalyticsTracker';
import { AuditoryPage } from '@/modules/auditory/pages/AuditoryPage';
import { AuthCallbackPage } from '@/modules/auth/pages/AuthCallbackPage';
import { LoginPage } from '@/modules/auth/pages/LoginPage';
import { ChatPage } from '@/modules/chat/components/ChatPage';
import { ChatViewPage } from '@/modules/chat/components/ChatViewPage';
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
import { AssumptionsPage } from '@/modules/soul/pages/AssumptionsPage';
import { ConstraintsPage } from '@/modules/soul/pages/ConstraintsPage';
import { DecisionsPage } from '@/modules/soul/pages/DecisionsPage';
import { DesiredOutcomesPage } from '@/modules/soul/pages/DesiredOutcomesPage';
import { OpenQuestionsPage } from '@/modules/soul/pages/OpenQuestionsPage';
import { ProjectContextPage } from '@/modules/soul/pages/ProjectContextPage';
import { ResourcesPage } from '@/modules/soul/pages/ResourcesPage';
import { TargetUsersPage } from '@/modules/soul/pages/TargetUsersPage';
import { WorkstreamsPage } from '@/modules/soul/pages/WorkstreamsPage';
import { CheckoutSuccessPage } from '@/modules/subscriptions/pages/CheckoutSuccessPage';
import { TimelinePage } from '@/modules/timeline/pages/TimelinePage';
import { AccountPage } from '@/modules/users/pages/AccountPage';
import { InternalElement } from '@/routing/components/InternalElement';
import { ProjectLayout } from '@/routing/components/ProjectLayout';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AnalyticsTracker />
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
              <ProjectLayout />
            </InternalElement>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="phase/:phaseId" element={<PhaseViewPage />} />
          <Route path="focus" element={<FocusPage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="competitors" element={<CompetitorsPage />} />
          <Route path="auditory" element={<AuditoryPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="chat/:chatId" element={<ChatViewPage />} />
          <Route path="open-questions" element={<OpenQuestionsPage />} />
          <Route path="assumptions" element={<AssumptionsPage />} />
          <Route path="workstreams" element={<WorkstreamsPage />} />
          <Route path="decisions" element={<DecisionsPage />} />
          <Route path="desired-outcomes" element={<DesiredOutcomesPage />} />
          <Route path="constraints" element={<ConstraintsPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="target-users" element={<TargetUsersPage />} />
          <Route path="context" element={<ProjectContextPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="milestone/:milestoneId" element={<MilestonePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
