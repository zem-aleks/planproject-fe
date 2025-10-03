import { ReactNode } from 'react';

import { AppSidebar } from '@/ui/components/app-sidebar.tsx';
import { SiteHeader } from '@/ui/components/site-header.tsx';
import { SidebarInset, SidebarProvider } from '@/ui/sidebar.tsx';

type Props = {
  children: ReactNode;
  header: {
    title: string;
    breadcrumbs: { title: string; href: string }[];
    actions?: ReactNode;
  };
};

export const PageTemplate = ({ children, header }: Props) => {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader
          breadcrumbs={header.breadcrumbs}
          title={header.title}
          actions={header.actions}
        />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
