import { Badge } from '@/ui/badge';
import { Label } from '@/ui/label';
import { Switch } from '@/ui/switch';

export const YearlySwitcher = ({
  isYearly,
  onChange,
}: {
  isYearly: boolean;
  onChange: (value: 'yearly' | 'monthly') => void;
}) => {
  return (
    <div className="flex flex-row items-center justify-center gap-3 rounded-lg bg-white p-4 px-8 shadow-sm shadow-gray-400">
      <div className="flex items-center space-x-2">
        <Label htmlFor="yearly-switcher" className={'cursor-pointer'}>
          <span
            className={`text-sm ${!isYearly ? 'font-semibold' : 'text-gray-500'}`}
          >
            Monthly
          </span>
        </Label>
        <Switch
          id="yearly-switcher"
          className={'cursor-pointer'}
          onCheckedChange={(checked) =>
            onChange(checked ? 'yearly' : 'monthly')
          }
        />
        <Label htmlFor="yearly-switcher" className={'cursor-pointer'}>
          <span
            className={`text-sm ${isYearly ? 'font-semibold' : 'text-gray-500'}`}
          >
            Yearly
          </span>
        </Label>
      </div>
      <Badge variant={isYearly ? 'default' : 'outline'}>2 months free</Badge>
    </div>
  );
};
