import axios from 'axios';

import { ENV } from '@/modules/config';

const apiServerUrl = ENV.VITE_BACKEND_URL;
let requestInterceptors: undefined | number;

export const api = axios.create({
  baseURL: `${apiServerUrl}`,
  timeout: 300000,
  headers: { 'Content-Type': 'application/json' },
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    switch (error.code) {
      default:
        return Promise.reject({ ...error, type: 'unknown' });
    }
  },
);

export const setApiAuth = (accessToken: string | undefined) => {
  if (typeof requestInterceptors !== 'undefined') {
    api.interceptors.request.eject(requestInterceptors);
  }

  // if access token is undefined, we eject interceptor and don't add a new one
  if (!accessToken) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  requestInterceptors = api.interceptors.request.use((config) => {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    };
  });
};
