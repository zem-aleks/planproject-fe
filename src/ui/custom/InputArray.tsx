import { Trash } from 'lucide-react';

import { Button } from '../button';
import { Input } from '../input';

export type Msg = {
  type: 'onInputArrayUpdated';
  inputValues: string[];
};

type Props = {
  values: string[];
  placeholder: string;
  onChange: (values: string[]) => void;
};

export const InputArray = ({ values, placeholder, onChange }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      {values.map((value, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) =>
              onChange(
                values.map((value, valueIndex) =>
                  index === valueIndex ? e.target.value : value,
                ),
              )
            }
          />
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              const temp = [...values];
              onChange(
                values.length > 1 ? (temp.splice(index, 1), temp) : [''],
              );
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <div>
        <Button type="button" onClick={() => onChange([...values, ''])}>
          Add message
        </Button>
      </div>
    </div>
  );
};
