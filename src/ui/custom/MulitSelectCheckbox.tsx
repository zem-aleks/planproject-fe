import { Checkbox } from '../checkbox';
import { Label } from '../label';
import { cn } from '../lib/utils';

type MultiSelectCheckboxProps<T> = {
  options: { label: string; value: T }[];
  selected: T[];
  onChange: (value: T[]) => void;
  className?: string;
};

export const MultiSelectCheckbox = <T,>({
  options,
  selected,
  onChange,
  className,
}: MultiSelectCheckboxProps<T>) => {
  return (
    <ul className={cn(className)}>
      {options.map((option) => (
        <li key={String(option.value)} className="flex items-center gap-2">
          <Checkbox
            checked={selected ? selected.includes(option.value) : false}
            onCheckedChange={(checked) => {
              onChange(
                checked
                  ? [...selected, option.value]
                  : selected.filter((s) => s !== option.value),
              );
            }}
          />
          <Label className="text-sm font-normal">{option.label}</Label>
        </li>
      ))}
    </ul>
  );
};
