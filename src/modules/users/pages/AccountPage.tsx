import { Link } from 'react-router';

import { useUser } from '@/modules/auth/contexts/UserContext';
import { SUBSCRIPTION_TITLES } from '@/modules/subscriptions/data/subscriptions';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Separator } from '@/ui/separator';

export const AccountPage = () => {
  const { user } = useUser();
  if (!user) {
    return null;
  }

  return (
    <PageTemplate
      header={{
        breadcrumbs: [{ title: 'Account', href: '/account' }],
        title: `Account`,
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className={'flex flex-row gap-8'}>
          <div className="flex grow flex-col gap-0">
            <h1
              className={
                'flex items-center justify-between gap-2 text-2xl font-semibold text-white'
              }
            >
              Account
            </h1>
            <div className={'text-gray-200'}>
              Here you can configure your account data and subscriptions
            </div>
          </div>
        </div>

        <Card className={'gap-4 p-4'}>
          <div className={'text-xl font-semibold'}>Subscription</div>
          <Separator />
          <div className={'flex items-center justify-between'}>
            <div>
              You're currently using{' '}
              <strong>{SUBSCRIPTION_TITLES[user.subscription]}</strong>
            </div>
            <Button variant={'default'} asChild>
              <Link to={'/pricing'} target={'_blank'}>
                Compare Plans
              </Link>
            </Button>
          </div>

          {user.subscription === 'basic' && (
            <>
              <Separator />
              <div className={'text-muted-foreground'}>
                You can upgrade to Pro plan to get access to 5 projects
              </div>
              <Button>Upgrade to Pro</Button>
            </>
          )}

          {user.subscription !== 'business' && (
            <>
              <Separator />
              <div className={'text-muted-foreground'}>
                Unlimited access and top new features
              </div>
              <Button>Upgrade to Business</Button>
            </>
          )}
        </Card>

        <Card className={'gap-4 p-4'}>
          <div className={'text-xl font-semibold'}>
            Profile Information (coming soon)
          </div>
          <Separator />
          <div className="flex justify-between gap-4">
            <Label htmlFor="firstName" className={'shrink-0'}>
              First Name
            </Label>
            <Input
              id="firstName"
              placeholder="First Name"
              className={'max-w-[300px]'}
              // error={Boolean(errors.title)}
            />
            {/*{errors.title && (*/}
            {/*  <p className="text-xs text-red-700">{errors.title.message}</p>*/}
            {/*)}*/}
          </div>
          <Separator />
          <div className="flex justify-between gap-4">
            <Label htmlFor="lastName" className={'shrink-0'}>
              Last Name
            </Label>
            <Input
              id="lastName"
              placeholder="Last Name"
              className={'max-w-[300px]'}
              // error={Boolean(errors.title)}
            />
            {/*{errors.title && (*/}
            {/*  <p className="text-xs text-red-700">{errors.title.message}</p>*/}
            {/*)}*/}
          </div>
          <Separator />
          <div className="flex justify-between gap-4">
            <Label htmlFor="email" className={'shrink-0'}>
              Email
            </Label>
            <Input
              id="email"
              placeholder="Email"
              className={'max-w-[300px]'}
              // error={Boolean(errors.title)}
            />
            {/*{errors.title && (*/}
            {/*  <p className="text-xs text-red-700">{errors.title.message}</p>*/}
            {/*)}*/}
          </div>

          <Separator />
          <Button>Save</Button>
        </Card>
      </div>
    </PageTemplate>
  );
};
