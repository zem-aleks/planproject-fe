import { useContext } from 'react';
import { Link } from 'react-router';

import { SelectedProjectContext } from '@/modules/projects/contexts/SelectedProjectContext.tsx';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/ui/sidebar';
import { type Icon, IconCompass } from '@tabler/icons-react';

export type NavItem = {
  title: string;
  url: string;
  icon?: Icon;
  isActive?: boolean;
};

export function NavMain({ items }: { items: NavItem[] }) {
  const { project } = useContext(SelectedProjectContext);
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 bg-neutral-900 text-neutral-50 duration-200 ease-linear hover:bg-neutral-900/90 hover:text-neutral-50 active:bg-neutral-900/90 active:text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 dark:hover:text-neutral-900 dark:active:bg-neutral-50/90 dark:active:text-neutral-900"
            >
              <IconCompass />
              {project ? (
                <span>{project.title}</span>
              ) : (
                <span>Project not selected</span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link to={item.url}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={item.isActive}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
