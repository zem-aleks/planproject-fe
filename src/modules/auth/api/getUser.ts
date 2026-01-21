import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { UserEntity } from '@/modules/users/types/user';

export const getUser = async (
  _: void,
  config?: AxiosRequestConfig,
): Promise<UserEntity> => {
  return api.get(`/users/me`, {
    signal: config?.signal,
  });
};
