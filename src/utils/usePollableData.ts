import { useCallback, useEffect, useRef, useState } from 'react';

import { AxiosError } from 'axios';

import { notReachable } from './notReachable';

export type PollingData<Data, Params = undefined, E = Error> =
  | { type: 'loading'; params: Params }
  | { type: 'loaded'; data: Data; params: Params }
  | { type: 'reloading'; data: Data; params: Params }
  | { type: 'error'; error: E; params: Params }
  | { type: 'stopped'; data: Data | null; params: Params };

type ReturnType<Data, Params, Error> = {
  state: PollingData<Data, Params, Error>;
  reload: () => void;
  stopPolling: () => void;
  continuePolling: () => void;
  setData: (data: Data) => void;
};

export const usePollingData = <Data, Params = undefined, E = AxiosError<Error>>(
  load: (params: Params) => Promise<Data>,
  params: Params,
  delay: number,
): ReturnType<Data, Params, E> => {
  const [state, setState] = useState<PollingData<Data, Params, E>>({
    type: 'loading',
    params,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const reload = useCallback(() => {
    setState((state) => ({ ...state, type: 'loading' }));
  }, []);

  const stopPolling = useCallback(() => {
    switch (state.type) {
      case 'error':
      case 'loading':
        setState((prevState) => ({
          ...prevState,
          type: 'stopped',
          data: null,
        }));
        break;

      case 'reloading':
      case 'loaded':
        setState((prevState) => ({
          ...prevState,
          type: 'stopped',
          data: state.data,
        }));
        break;

      case 'stopped':
        break;

      default:
        return notReachable(state);
    }
  }, [state]);

  const continuePolling = useCallback(() => {
    switch (state.type) {
      case 'error':
      case 'loading':
      case 'reloading':
      case 'loaded':
        console.warn('Polling is not stopped');
        break;

      case 'stopped':
        if (state.data) {
          return setState({
            type: 'reloading',
            data: state.data,
            params: state.params,
          });
        }

        reload();
        break;

      default:
        return notReachable(state);
    }
  }, [reload, state]);

  const setData = useCallback(
    (data: Data) => {
      switch (state.type) {
        case 'loading':
        case 'error':
          break;

        case 'reloading':
        case 'loaded':
        case 'stopped':
          setState({ ...state, data });
          break;

        default:
          return notReachable(state);
      }
    },
    [state],
  );

  useEffect(() => {
    switch (state.type) {
      case 'reloading':
      case 'loading':
        load(params)
          .then((data) => {
            if (stateRef.current.type === 'stopped') {
              setState({ type: 'stopped', data: data, params: state.params });
            } else {
              setState({ type: 'loaded', data: data, params: state.params });
            }
          })
          .catch((error) => {
            setState({ type: 'error', error, params: state.params });
          });
        break;

      case 'loaded': {
        const timer = setTimeout(() => {
          if (stateRef.current.type === 'loaded') {
            setState({
              type: 'reloading',
              data: state.data,
              params: state.params,
            });
          }
        }, delay);

        return () => clearTimeout(timer);
      }

      case 'stopped':
      case 'error':
        break;

      default:
        return notReachable(state);
    }
  }, [delay, load, params, state]);

  return {
    state,
    reload,
    stopPolling,
    continuePolling,
    setData,
  };
};
