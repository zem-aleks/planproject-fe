import { useCallback, useEffect, useState } from 'react';

import { AxiosError, AxiosRequestConfig } from 'axios';

import { cancelable } from '@/utils/cancelable';
import { LoadableData } from '@/utils/useLoadableData';

import { notReachable } from './notReachable';

export type LazyLoadableData<Data, Params = undefined, E = AxiosError<Error>> =
  | LoadableData<Data, Params, E>
  | { type: 'not_requested' };

export type LazyLoadableReturnType<Data, Params, Error> = {
  state: LazyLoadableData<Data, Params, Error>;
  load: (params: Params) => void;
  reset: () => void;
  // setParams: (params: Params) => void;
  // setError: (params: Error) => void;
};

export const useLazyLoadableData = <
  Data,
  Params = undefined,
  E = AxiosError<Error>,
>(
  loadData: (params: Params, config?: AxiosRequestConfig) => Promise<Data>,
): LazyLoadableReturnType<Data, Params, E> => {
  const [state, setState] = useState<LazyLoadableData<Data, Params, E>>({
    type: 'not_requested',
  });

  useEffect(() => {
    switch (state.type) {
      case 'loading': {
        const [promise, cancel] = cancelable((config) =>
          loadData(state.params, config),
        );

        promise
          .then((data) => {
            setState({ type: 'loaded', data: data, params: state.params });
          })
          .catch((error) => {
            if (error.type !== 'canceledRequest') {
              setState({ type: 'error', error, params: state.params });
            }
          });

        return cancel;
      }

      case 'loaded':
      case 'error':
      case 'not_requested':
        break;

      default:
        return notReachable(state);
    }
  }, [loadData, state]);

  const load = useCallback<(params: Params) => void>(
    (params) => setState({ type: 'loading', params }),
    [],
  );

  const reset = useCallback(() => setState({ type: 'not_requested' }), []);

  return {
    state,
    load,
    reset,
  };
};
