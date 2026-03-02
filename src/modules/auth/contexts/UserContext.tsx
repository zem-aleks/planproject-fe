import { ReactNode, createContext, useContext } from 'react';

import type { AxiosError } from 'axios';

import { queryKeys } from '@/lib/queryKeys';
import { getUser } from '@/modules/auth/api/getUser';
import { useAuthSession } from '@/modules/auth/contexts/AuthSessionContext';
import { UserEntity } from '@/modules/users/types/user';
import { noOperation, notReachable } from '@/utils/notReachable';
import { useQuery } from '@tanstack/react-query';

type UserContextData = { user: UserEntity | null; reload: () => void };

const emptyContextValue: UserContextData = { user: null, reload: noOperation };

export const UserContext = createContext<UserContextData>(emptyContextValue);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useAuthSession();
  const { data, status, refetch } = useQuery<UserEntity, AxiosError<Error>>({
    queryKey: queryKeys.user.current(),
    queryFn: ({ signal }) => getUser(undefined, { signal }),
    enabled: !!session,
  });

  if (!session)
    return (
      <UserContext.Provider value={{ user: null, reload: noOperation }}>
        {children}
      </UserContext.Provider>
    );

  switch (status) {
    case 'pending':
    case 'error':
      return (
        <UserContext.Provider value={{ user: null, reload: refetch }}>
          {children}
        </UserContext.Provider>
      );

    case 'success':
      return (
        <UserContext.Provider value={{ user: data!, reload: refetch }}>
          {children}
        </UserContext.Provider>
      );

    default:
      return notReachable(status);
  }
};

export const useUser = (): UserContextData => {
  return useContext(UserContext);
};
