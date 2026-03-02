import type { AxiosError } from 'axios';

export type LoadableData<Data, Params = void, E = AxiosError<Error>> =
  | { type: 'loading'; params: Params }
  | { type: 'loaded'; data: Data; params: Params }
  | { type: 'error'; error: E; params: Params };

export type ReloadableData<Data, Params = void, E = AxiosError<Error>> =
  | { type: 'loading'; params: Params }
  | { type: 'loaded'; data: Data; params: Params }
  | { type: 'reloading'; data: Data; params: Params }
  | { type: 'error'; error: E; params: Params };

export type LazyLoadableData<Data, Params = undefined, E = AxiosError<Error>> =
  | LoadableData<Data, Params, E>
  | { type: 'not_requested' };

export type PollingData<Data, Params = void, E = Error> =
  | { type: 'loading'; params: Params }
  | { type: 'loaded'; data: Data; params: Params }
  | { type: 'reloading'; data: Data; params: Params }
  | { type: 'error'; error: E; params: Params }
  | { type: 'stopped'; data: Data | null; params: Params };
