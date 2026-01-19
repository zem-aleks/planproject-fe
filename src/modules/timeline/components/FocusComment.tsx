import { ShapingComment } from '@/modules/shaping/components/ShapingComment';
import { getFocusComment } from '@/modules/timeline/api/getFocusComment';
import { notReachable } from '@/utils/notReachable';
import { useLoadableData } from '@/utils/useLoadableData';

export const FocusComment = ({ projectId }: { projectId: string }) => {
  const { state } = useLoadableData(getFocusComment, projectId);

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
