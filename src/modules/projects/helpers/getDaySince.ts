import dayjs from 'dayjs';

export const getDaySince = (startedAt: Date): number =>
  dayjs().diff(startedAt, 'days') + 1;
