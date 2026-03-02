import { useCallback } from 'react';

import type { AxiosError } from 'axios';

import type { LazyLoadableData } from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';

type Options<Data, Params> = {
  mutationFn: (params: Params) => Promise<Data>;
  invalidateKeys?: QueryKey[] | ((data: Data) => QueryKey[]);
  onSuccess?: (data: Data) => void;
};

type ReturnType<Data, Params, E> = {
  state: LazyLoadableData<Data, Params, E>;
  load: (params: Params) => void;
  reset: () => void;
};

export const useLazyMutation = <
  Data,
  Params = undefined,
  E = AxiosError<Error>,
>(
  options: Options<Data, Params>,
): ReturnType<Data, Params, E> => {
  const queryClient = useQueryClient();
  const { mutationFn, invalidateKeys, onSuccess } = options;

  const mutation = useMutation<Data, AxiosError<Error>, Params>({
    mutationFn,
    onSuccess: (data, variables) => {
      const keys =
        typeof invalidateKeys === 'function'
          ? invalidateKeys(data)
          : invalidateKeys;

      if (keys) {
        keys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }

      onSuccess?.(data);

      // Store variables for state derivation
      mutation.variables = variables;
    },
  });

  const load = useCallback(
    (params: Params) => {
      mutation.mutate(params);
    },
    [mutation],
  );

  const reset = useCallback(() => {
    mutation.reset();
  }, [mutation]);

  const state = ((): LazyLoadableData<Data, Params, E> => {
    if (mutation.isIdle) {
      return { type: 'not_requested' };
    }
    if (mutation.isPending) {
      return {
        type: 'loading',
        params: mutation.variables as Params,
      };
    }
    if (mutation.isError) {
      return {
        type: 'error',
        error: mutation.error as E,
        params: mutation.variables as Params,
      };
    }
    return {
      type: 'loaded',
      data: mutation.data!,
      params: mutation.variables as Params,
    };
  })();

  return { state, load, reset };
};
