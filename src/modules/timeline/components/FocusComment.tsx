import type { AxiosError } from 'axios';

import { queryKeys } from '@/lib/queryKeys';
import { ShapingComment } from '@/modules/shaping/components/ShapingComment';
import { getFocusComment } from '@/modules/timeline/api/getFocusComment';
import { notReachable } from '@/utils/notReachable';
import { useQuery } from '@tanstack/react-query';

export const FocusComment = ({ projectId }: { projectId: string }) => {
  const { data, status } = useQuery<string, AxiosError<Error>>({
    queryKey: queryKeys.timeline.focusComment(projectId),
    queryFn: ({ signal }) => getFocusComment(projectId, { signal }),
  });

  switch (status) {
    case 'pending':
      return <ShapingComment comment={''} loading={true} />;

    case 'success':
      return <ShapingComment comment={data!} />;

    case 'error':
      return null;

    default:
      return notReachable(status);
  }
};
