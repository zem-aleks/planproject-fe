import { PhaseStatus } from '@/modules/phases/types/entity';
import { Badge } from '@/ui/badge';
import { notReachable } from '@/utils/notReachable';

export const PhaseStatusBadge = ({
  status,
  className,
}: {
  status: PhaseStatus;
  className?: string;
}) => {
  switch (status) {
    case 'notStarted':
      return <Badge className={className}>Not started</Badge>;

    case 'building':
      return (
        <Badge className={className} variant={'warning'}>
          Building
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

    case 'error':
      return (
        <Badge className={className} variant={'warning'}>
          Error
        </Badge>
      );

    default:
      return notReachable(status);
  }
};
