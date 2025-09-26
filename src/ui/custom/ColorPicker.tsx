import { useState } from 'react';
import { HexAlphaColorPicker } from 'react-colorful';

import { X } from 'lucide-react';

import { cn } from '@/ui/lib/utils';
import { PopoverClose } from '@radix-ui/react-popover';

import { Button } from '../button';
import { Input } from '../input';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';

export const ColorPicker = ({
  onSelected,
  placeholder,
  color,
}: {
  onSelected: (color: string | null) => void;
  placeholder?: string;
  color: string | null;
}) => {
  const [popoverColor, setPopoverColor] = useState<string | null>(color);

  return (
    <div className={'relative flex items-center gap-2'}>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              `focus-visible:ring-ring size-9 cursor-pointer rounded-sm border shadow-sm transition-colors`,
              !color && `border-dashed border-gray-400 bg-gray-100/50`,
            )}
            style={{ backgroundColor: color ?? undefined }}
            onClick={() => setPopoverColor(color || '#FFFFFF')}
          />
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="start"
          sideOffset={3}
          className="w-fit p-0"
        >
          <div className="flex w-full items-center justify-end border-b border-b-gray-200 p-2">
            <PopoverClose
              aria-label="Close"
              className="focus:outline-none focus-visible:ring-0"
            >
              <X className="h-4 w-4 cursor-pointer border-none" />
            </PopoverClose>
          </div>
          <div className="flex flex-col gap-2 p-3">
            <HexAlphaColorPicker
              color={popoverColor ?? undefined}
              onChange={(color) => setPopoverColor(color.toUpperCase())}
            />
            <div className="flex items-center gap-2">
              <div
                className="size-8 rounded-sm border"
                style={{ backgroundColor: popoverColor ?? undefined }}
              />
              <p className="text-muted-foreground text-sm">{popoverColor}</p>
            </div>
            <PopoverClose aria-label="confirm" className="w-full">
              <Button
                role="button"
                variant="default"
                className="w-full"
                onClick={() => {
                  onSelected(popoverColor);
                }}
              >
                Confirm
              </Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>

      <Input
        id="color"
        placeholder={placeholder}
        value={color || undefined}
        onChange={(e) => onSelected(e.target.value)}
      />
    </div>
  );
};
