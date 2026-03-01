import { ProjectStatus } from '@/modules/projects/types/entity';
import { Badge } from '@/ui/badge';
import { notReachable } from '@/utils/notReachable';

export const ProjectStatusBadge = ({ status }: { status: ProjectStatus }) => {
  switch (status) {
    case 'shaping':
    case 'analyzing':
      return <Badge className={''}>Status: {status}</Badge>;

    case 'soulBuilding':
    case 'soulError':
    case 'soulDone':
      return null;

    case 'active':
      return (
        <Badge className={''} variant={'warning'}>
          Status: Active
        </Badge>
      );

    case 'completed':
      return (
        <Badge className={''} variant={'success'}>
          Status: Completed
        </Badge>
      );

    case 'draft':
    case 'onHold':
    case 'cancelled':
      return (
        <Badge className={''} variant={'outline'}>
          Status: {status}
        </Badge>
      );

    default:
      return notReachable(status);
  }
};
