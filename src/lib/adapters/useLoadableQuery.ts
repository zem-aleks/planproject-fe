import type { AxiosError } from 'axios';

import type { LoadableData } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';

type Options<Data> = {
  queryKey: QueryKey;
  queryFn: (ctx: { signal: AbortSignal }) => Promise<Data>;
} & Omit<UseQueryOptions<Data, AxiosError<Error>>, 'queryKey' | 'queryFn'>;

type ReturnType<Data, E> = {
  state: LoadableData<Data, void, E>;
  reload: () => void;
};

export const useLoadableQuery = <Data, E = AxiosError<Error>>(
  options: Options<Data>,
): ReturnType<Data, E> => {
  const { data, error, isLoading, isError, refetch } = useQuery<
    Data,
    AxiosError<Error>
  >(options);

  const reload = () => {
    refetch();
  };

  const state = ((): LoadableData<Data, void, E> => {
    if (isLoading) {
      return { type: 'loading', params: undefined as void };
    }
    if (isError) {
      return { type: 'error', error: error as E, params: undefined as void };
    }
    return { type: 'loaded', data: data!, params: undefined as void };
  })();

  return { state, reload };
};
