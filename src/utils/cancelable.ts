import { AxiosRequestConfig } from 'axios';

export type CancelRequestError = Error & {
  type: 'canceledRequest';
};

export type CancelablePromise<Data> = [Promise<Data>, () => void];

export const cancelable = <Data>(
  loadData: (config: AxiosRequestConfig) => Promise<Data>,
): CancelablePromise<Data> => {
  const controller = new AbortController();
  const promise = loadData({
    signal: controller.signal,
  });

  return [
    promise,
    () => {
      controller.abort();
    },
  ];
};
