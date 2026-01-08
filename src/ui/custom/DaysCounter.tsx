import { getDaySince } from '@/modules/projects/helpers/getDaySince';
import { Separator } from '@/ui/separator';

export const DaysCounter = ({
  startedAt,
  daysCount,
}: {
  startedAt: Date;
  daysCount: number | null;
}) => {
  return (
    <div
      className={
        'mb-2 min-w-[128px] shrink-0 self-start rounded-lg border bg-white p-2 text-gray-700 shadow'
      }
    >
      <div className={'text-2xl'}>Day {getDaySince(startedAt)}</div>
      <Separator className={'my-2'} />
      Out of {daysCount || 'N/A'} days
    </div>
  );
};
