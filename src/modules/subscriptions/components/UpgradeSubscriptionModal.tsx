import { Link } from 'react-router';

import { LockIcon, LockOpen } from 'lucide-react';

import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';

export const UpgradeSubscriptionModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => !open && onClose()}
      modal={true}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={'text-xl'}>
            <LockIcon className={'mb-2'} />
            Functionality is Locked
          </DialogTitle>
          <DialogDescription className={'text-muted-foreground w-full'}>
            You can use this functionality on Pro Plan or on Business Plan
          </DialogDescription>
        </DialogHeader>

        <Button className={'w-full'} asChild>
          <Link to={'/account'}>
            <LockOpen /> Upgrade Subscription
          </Link>
        </Button>
      </DialogContent>
    </Dialog>
  );
};
