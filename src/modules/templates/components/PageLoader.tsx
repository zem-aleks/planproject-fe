import { PageTemplate } from '@/modules/templates/components/PageTemplate';
import { Skeleton } from '@/ui/skeleton';

export const PageLoader = () => {
  return (
    <PageTemplate
      header={{
        breadcrumbs: [],
        title: 'Loading...',
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Skeleton className="aspect-video rounded-xl" />
          <Skeleton className="aspect-video rounded-xl" />
          <Skeleton className="aspect-video rounded-xl" />
        </div>
      </div>
    </PageTemplate>
  );
};
