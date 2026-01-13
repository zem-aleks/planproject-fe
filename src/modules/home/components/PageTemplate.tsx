import { ReactNode, useState } from 'react';
import { Link } from 'react-router';

import dayjs from 'dayjs';
import { Heart } from 'lucide-react';

import { useAuthSession } from '@/modules/auth/contexts/AuthSessionContext';
import { GradientBackground } from '@/modules/home/components/GradientBackground';
import { LogoBlockWhite } from '@/modules/home/components/LogoBlockWhite';
import { ShapingModal } from '@/modules/shaping/components/ShapingModal';
import { Button } from '@/ui/button';
import { Separator } from '@/ui/separator';
import { notReachable } from '@/utils/notReachable';

export const PageTemplate = ({
  children,
}: {
  children: (openOnboarding: () => void) => ReactNode;
}) => {
  const { session } = useAuthSession();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className={'bg-background relative min-h-screen'}>
      <ShapingModal
        open={open}
        onMsg={(msg) => {
          switch (msg.type) {
            case 'onClose':
              setOpen(false);
              break;

            default:
              return notReachable(msg.type);
          }
        }}
      />

      <div className={'absolute top-0 left-0 z-20 h-[700px] w-full'}>
        <GradientBackground />
      </div>

      <header className={'absolute top-0 z-50 w-full border-b'}>
        <div className="container mx-auto px-4">
          <div className={'flex h-16 items-center justify-between'}>
            <Link to={'/'}>
              <LogoBlockWhite />
            </Link>

            {session ? (
              <Button asChild>
                <Link to={'/projects'}>Dashboard</Link>
              </Button>
            ) : (
              <div className={'flex items-center gap-2'}>
                <Button asChild variant={'outline'}>
                  <Link to={'/login'}>Log In</Link>
                </Button>
                <Button onClick={() => setOpen(true)}>Try for Free</Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {children(() => setOpen(true))}

      <footer className={'bg-primary text-primary-foreground pt-16 pb-8'}>
        <div className="container mx-auto px-4">
          <div className={'flex items-center justify-between'}>
            <div className={'flex shrink-0 flex-col gap-1'}>
              <Link to={'/'}>
                <LogoBlockWhite />
              </Link>

              <div className={'mt-2'}>
                Platform that transforms your ideas into structured project
                plans
              </div>
              <div className={'flex gap-1'}>
                Made with <Heart className={'text-pink-700'} /> by Oleksii
                Zemliakov
              </div>
            </div>
          </div>
        </div>

        <Separator className={'mt-12 mb-8'} />

        <div className="container mx-auto px-4">
          <div className={'flex items-center justify-between'}>
            <div className={'flex flex-wrap items-center gap-3'}>
              <Link
                to={'/p/terms'}
                className={'hover:underline active:underline'}
              >
                Terms of Use
              </Link>

              <Separator
                orientation={'vertical'}
                className={'!h-4 border-white bg-white text-white'}
              />

              <Link
                to={'/p/privacy-policy'}
                className={'hover:underline active:underline'}
              >
                Privacy Policy
              </Link>
            </div>
            <div className={'flex items-center capitalize'}>
              ©{dayjs().format('YYYY')} All rights reserved
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
