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
      <DialogContent showCloseButton={false} className={'min-w-xl'}>
        <DialogHeader className={'flex flex-col items-center gap-4'}>
          <Rocket className={'mt-8 mb-4 size-40 text-orange-400'} />
          <DialogTitle className={'text-center text-3xl font-bold'}>
            Welcome to your new Project Plan!
          </DialogTitle>
          <DialogDescription
            className={'text-muted-foreground w-full px-2 text-center text-xl'}
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
