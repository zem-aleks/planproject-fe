import { useLoadableQuery } from '@/lib/adapters';
import { queryKeys } from '@/lib/queryKeys';
import { ShapingComment } from '@/modules/shaping/components/ShapingComment';
import { getFocusComment } from '@/modules/timeline/api/getFocusComment';
import { notReachable } from '@/utils/notReachable';

export const FocusComment = ({ projectId }: { projectId: string }) => {
  const { state } = useLoadableQuery<string>({
    queryKey: queryKeys.timeline.focusComment(projectId),
    queryFn: ({ signal }) => getFocusComment(projectId, { signal }),
  });

  switch (state.type) {
    case 'loading':
      return <ShapingComment comment={''} loading={true} />;

    case 'loaded':
      return <ShapingComment comment={state.data} />;

    case 'error':
      return null;

    default:
      return notReachable(state);
  }
};
