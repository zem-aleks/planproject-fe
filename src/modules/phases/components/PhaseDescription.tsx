import { PhaseEntity } from '@/modules/phases/types/entity';
import { Badge } from '@/ui/badge';

export const PhaseDescription = ({
  phase,
  variant = 'primary',
}: {
  phase: PhaseEntity;
  variant?: 'primary' | 'secondary';
}) => {
  return (
    <div className={'flex flex-col gap-4'}>
      <p className={variant === 'primary' ? 'text-gray-200' : 'text-black'}>
        {phase.description || 'No description available'}
      </p>
      <div
        className={`flex items-center gap-2 ${variant === 'primary' ? 'text-white' : 'text-black'}`}
      >
        Expertise needed:{' '}
        <div className={'flex flex-wrap gap-1'}>
          {phase.expertiseNeeded.split(',').map((expertise) => (
            <Badge className={'bg-green-600 text-white'}>
              {expertise.trim()}
            </Badge>
          ))}
        </div>
      </div>
      <div
        className={`flex items-center gap-1 ${variant === 'primary' ? 'text-white' : 'text-black'}`}
      >
        Estimation: <Badge>Min {phase.minDaysNeeded} days</Badge>
        <Badge>Max {phase.maxDaysNeeded} days</Badge>
      </div>
    </div>
  );
};
