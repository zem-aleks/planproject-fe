import type { AxiosError } from 'axios';

import type { ReloadableData } from '@/lib/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';

type Options<Data> = {
  queryKey: QueryKey;
  queryFn: (ctx: { signal: AbortSignal }) => Promise<Data>;
} & Omit<UseQueryOptions<Data, AxiosError<Error>>, 'queryKey' | 'queryFn'>;

type ReturnType<Data, E> = {
  state: ReloadableData<Data, void, E>;
  reload: () => void;
  setData: (data: Data) => void;
};

export const useReloadableQuery = <Data, E = AxiosError<Error>>(
  options: Options<Data>,
): ReturnType<Data, E> => {
  const queryClient = useQueryClient();

  const { data, error, isLoading, isFetching, isError, refetch } = useQuery<
    Data,
    AxiosError<Error>
  >(options);

  const reload = () => {
    refetch();
  };

  const setData = (newData: Data) => {
    queryClient.setQueryData(options.queryKey, newData);
  };

  const state = ((): ReloadableData<Data, void, E> => {
    if (isLoading) {
      return { type: 'loading', params: undefined as void };
    }
    if (isError) {
      return { type: 'error', error: error as E, params: undefined as void };
    }
    if (isFetching && data !== undefined) {
      return {
        type: 'reloading',
        data: data!,
        params: undefined as void,
      };
    }
    return { type: 'loaded', data: data!, params: undefined as void };
  })();

  return { state, reload, setData };
};
