import { useCallback, useState } from 'react';

import type { AxiosError } from 'axios';

import type { PollingData } from '@/lib/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';

type Options<Data> = {
  queryKey: QueryKey;
  queryFn: (ctx: { signal: AbortSignal }) => Promise<Data>;
  interval: number;
} & Omit<
  UseQueryOptions<Data, AxiosError<Error>>,
  'queryKey' | 'queryFn' | 'refetchInterval'
>;

type ReturnType<Data, E> = {
  state: PollingData<Data, void, E>;
  reload: () => void;
  stopPolling: () => void;
  continuePolling: () => void;
  setData: (data: Data) => void;
};

export const usePollingQuery = <Data, E = AxiosError<Error>>(
  options: Options<Data>,
): ReturnType<Data, E> => {
  const { interval, ...queryOptions } = options;
  const [stopped, setStopped] = useState(false);
  const queryClient = useQueryClient();

  const { data, error, isLoading, isFetching, isError, refetch } = useQuery<
    Data,
    AxiosError<Error>
  >({
    ...queryOptions,
    refetchInterval: stopped ? false : interval,
  });

  const reload = useCallback(() => {
    refetch();
  }, [refetch]);

  const stopPolling = useCallback(() => {
    setStopped(true);
  }, []);

  const continuePolling = useCallback(() => {
    setStopped(false);
    refetch();
  }, [refetch]);

  const setData = useCallback(
    (newData: Data) => {
      queryClient.setQueryData(options.queryKey, newData);
    },
    [queryClient, options.queryKey],
  );

  const state = ((): PollingData<Data, void, E> => {
    if (stopped) {
      return {
        type: 'stopped',
        data: data ?? null,
        params: undefined as void,
      };
    }
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

  return { state, reload, stopPolling, continuePolling, setData };
};
