import { MilestoneStatus } from '@/modules/milestones/types/entity';
import { Badge } from '@/ui/badge';
import { notReachable } from '@/utils/notReachable';

export const MilestoneStatusBadge = ({
  status,
  className,
}: {
  status: MilestoneStatus;
  className?: string;
}) => {
  switch (status) {
    case 'notStarted':
      return (
        <Badge className={className} variant={'default'}>
          Not Started
        </Badge>
      );

    case 'inProgress':
      return (
        <Badge className={className} variant={'warning'}>
          In progress
        </Badge>
      );

    case 'completed':
      return (
        <Badge className={className} variant={'success'}>
          Completed
        </Badge>
      );

    default:
      notReachable(status);
  }
};
