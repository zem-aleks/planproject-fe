import { ReactNode, createContext, useContext } from 'react';

import { useLoadableQuery } from '@/lib/adapters';
import { queryKeys } from '@/lib/queryKeys';
import { getUser } from '@/modules/auth/api/getUser';
import { useAuthSession } from '@/modules/auth/contexts/AuthSessionContext';
import { UserEntity } from '@/modules/users/types/user';
import { noOperation, notReachable } from '@/utils/notReachable';

type UserContextData = { user: UserEntity | null; reload: () => void };

const emptyContextValue: UserContextData = { user: null, reload: noOperation };

export const UserContext = createContext<UserContextData>(emptyContextValue);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useAuthSession();
  const { state, reload } = useLoadableQuery<UserEntity>({
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

  switch (state.type) {
    case 'loading':
    case 'error':
      return (
        <UserContext.Provider value={{ user: null, reload }}>
          {children}
        </UserContext.Provider>
      );

    case 'loaded':
      return (
        <UserContext.Provider value={{ user: state.data, reload }}>
          {children}
        </UserContext.Provider>
      );

    default:
      return notReachable(state);
  }
};

export const useUser = (): UserContextData => {
  return useContext(UserContext);
};
