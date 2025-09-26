import { useCallback, useEffect, useState } from 'react';

import { AxiosError, AxiosRequestConfig } from 'axios';

import { cancelable } from '@/utils/cancelable';

import { notReachable } from './notReachable';

export type LoadableData<Data, Params, E = AxiosError<Error>> =
  | { type: 'loading'; params: Params }
  | { type: 'loaded'; data: Data; params: Params }
  | { type: 'error'; error: E; params: Params };

type ReturnType<Data, Params, Error> = {
  state: LoadableData<Data, Params, Error>;
  reload: () => void;
};

export const useLoadableData = <
  Data,
  Params = undefined,
  E = AxiosError<Error>,
>(
  load: (params: Params, config?: AxiosRequestConfig) => Promise<Data>,
  params: Params,
): ReturnType<Data, Params, E> => {
  const [state, setState] = useState<LoadableData<Data, Params, E>>({
    type: 'loading',
    params: params,
  });

  const reload = useCallback(() => {
    switch (state.type) {
      case 'loading':
        setState({ type: 'loading', params });
        break;

      case 'loaded':
      case 'error':
        setState({ type: 'loading', params });
        break;

      default:
        return notReachable(state);
    }
  }, [state, params]);

  // when parameters are changed, we do reloading. Probably it shouldn't be done,
  // but it looks like a most common behaviour
  useEffect(() => {
    if (
      params !== state.params &&
      JSON.stringify(params) !== JSON.stringify(state.params)
    ) {
      reload();
    }
  }, [state, params, reload]);

  useEffect(() => {
    switch (state.type) {
      case 'loading': {
        const [promise, cancel] = cancelable((config) =>
          load(state.params, config),
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
        break;

      default:
        return notReachable(state);
    }
  }, [load, state]);

  return {
    state,
    reload,
  };
};
