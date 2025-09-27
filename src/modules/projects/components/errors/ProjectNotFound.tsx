import { Link } from 'react-router';

import { PageTemplate } from '@/modules/templates/components/PageTemplate';
import { Button } from '@/ui/button';

export const ProjectNotFound = () => {
  return (
    <PageTemplate
      header={{
        breadcrumbs: [{ title: 'Projects', href: '/projects' }],
        title: 'Project not found',
      }}
    >
      <div
        className={'flex flex-col items-center justify-center gap-1 px-8 py-2'}
      >
        <h1 className="text-2xl font-bold">No Project Found</h1>
        <p className="text-lg">Please select an project to continue.</p>
        <Button asChild size="sm" className="mt-2">
          <Link to="/projects">Select Project</Link>
        </Button>
      </div>
    </PageTemplate>
  );
};
