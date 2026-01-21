import { Link } from 'react-router';

import { useUser } from '@/modules/auth/contexts/UserContext';
import { SUBSCRIPTION_TITLES } from '@/modules/subscriptions/data/subscriptions';
import { supabase } from '@/modules/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/ui/sidebar';
import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from '@tabler/icons-react';

export function NavUser() {
  // const navigate = useNavigate();
  const { isMobile } = useSidebar();
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/*<Avatar className="h-8 w-8 rounded-lg grayscale">*/}
              {/*  <AvatarImage*/}
              {/*    src={user?.avatarUrl ?? undefined}*/}
              {/*    alt={user?.email}*/}
              {/*  />*/}
              {/*  <AvatarFallback className="rounded-lg">*/}
              {/*    PlanProject*/}
              {/*  </AvatarFallback>*/}
              {/*</Avatar>*/}
              <div className="grid flex-1 pl-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {SUBSCRIPTION_TITLES[user.subscription]}
                </span>
                <span className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {/*<Avatar className="h-8 w-8 rounded-lg">*/}
                {/*  <AvatarImage*/}
                {/*    src={user?.avatarUrl ?? undefined}*/}
                {/*    alt={user?.email}*/}
                {/*  />*/}
                {/*  <AvatarFallback className="rounded-lg">CN</AvatarFallback>*/}
                {/*</Avatar>*/}
                <div className="grid flex-1 pl-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {SUBSCRIPTION_TITLES[user.subscription]}
                  </span>
                  <span className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild={true}>
                <Link to={'/account'}>
                  <IconUserCircle />
                  Account
                </Link>
              </DropdownMenuItem>

              {/*<DropdownMenuItem>*/}
              {/*  <IconCreditCard />*/}
              {/*  Billing*/}
              {/*</DropdownMenuItem>*/}
              {/*<DropdownMenuItem>*/}
              {/*  <IconNotification />*/}
              {/*  Notifications*/}
              {/*</DropdownMenuItem>*/}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => supabase.auth.signOut()}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
