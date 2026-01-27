import { useSearchParams } from 'react-router';

import { Rocket } from 'lucide-react';

import { Button } from '@/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';

export const WelcomeModal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isNew = searchParams.get('new') === 'true';
  return (
    <Dialog
      open={isNew}
      onOpenChange={(open) => !open && setSearchParams({})}
      modal={true}
    >
      <DialogContent
        showCloseButton={false}
        className="flex h-[600px] max-h-[96%] w-[94%] max-w-full flex-col items-center justify-center gap-4 rounded-md p-0 px-4 lg:w-[1200px]"
      >
        <DialogHeader className={'flex flex-col items-center gap-4'}>
          <Rocket
            className={
              'mt-8 mb-4 size-20 text-orange-400 sm:size-30 md:size-40'
            }
          />
          <DialogTitle className={'text-center text-2xl font-bold md:text-3xl'}>
            Welcome to your new Project Plan!
          </DialogTitle>
          <DialogDescription
            className={
              'text-muted-foreground w-full px-2 text-center text-lg md:text-xl'
            }
          >
            Please review the phases and milestones. Once you're ready, press
            the <b>Start Project</b> button to kick off the project.
          </DialogDescription>
        </DialogHeader>

        <DialogClose asChild>
          <Button size={'lg'} className={'text-[16px]'}>
            Let's begin!
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
