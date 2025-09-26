import { useCallback, useEffect, useState } from 'react';

import { AxiosError, AxiosRequestConfig } from 'axios';

import { cancelable } from '@/utils/cancelable';

import { notReachable } from './notReachable';

export type ReloadableData<Data, Params, E = AxiosError<Error>> =
  | { type: 'loading'; params: Params }
  | { type: 'loaded'; data: Data; params: Params }
  | { type: 'reloading'; data: Data; params: Params }
  | { type: 'error'; error: E; params: Params };

type ReturnType<Data, Params, Error> = {
  state: ReloadableData<Data, Params, Error>;
  reload: () => void;
  setData: (data: Data) => void;
};

export const useReloadableData = <
  Data,
  Params = undefined,
  E = AxiosError<Error>,
>(
  load: (params: Params, config?: AxiosRequestConfig) => Promise<Data>,
  params: Params,
): ReturnType<Data, Params, E> => {
  const [state, setState] = useState<ReloadableData<Data, Params, E>>({
    type: 'loading',
    params: params,
  });

  const reload = useCallback(() => {
    switch (state.type) {
      case 'loading':
        setState({ type: 'loading', params });
        break;

      case 'reloading':
      case 'loaded':
        setState({ type: 'reloading', params, data: state.data });
        break;

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
      case 'reloading':
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

  const setData = useCallback(
    (data: Data) => {
      switch (state.type) {
        case 'loading':
        case 'error':
          break;

        case 'reloading':
        case 'loaded':
          setState({ ...state, data });
          break;

        default:
          return notReachable(state);
      }
    },
    [state],
  );

  return {
    state,
    reload,
    setData,
  };
};
