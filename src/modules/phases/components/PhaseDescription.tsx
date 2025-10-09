import { PhaseEntity } from '@/modules/phases/types/entity';
import { Badge } from '@/ui/badge';

export const PhaseDescription = ({ phase }: { phase: PhaseEntity }) => {
  return (
    <div className={'flex flex-col gap-1'}>
      <p className={''}>{phase.description || 'No description available'}</p>
      <div className={'text-muted-foreground flex items-center gap-2'}>
        Expertise needed:{' '}
        <div className={'flex gap-1'}>
          {phase.expertiseNeeded.split(',').map((expertise) => (
            <Badge className={'bg-green-600 text-white'}>
              {expertise.trim()}
            </Badge>
          ))}
        </div>
      </div>
      <div className={'text-muted-foreground flex items-center gap-2'}>
        Estimation: <Badge>Min {phase.minDaysNeeded} days</Badge>
        <Badge>Max {phase.maxDaysNeeded} days</Badge>
      </div>
    </div>
  );
};
