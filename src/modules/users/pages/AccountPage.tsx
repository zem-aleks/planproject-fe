import { useState } from 'react';
import { Link } from 'react-router';

import { useUser } from '@/modules/auth/contexts/UserContext';
import { ManageSubscriptionForm } from '@/modules/subscriptions/components/ManageSubscriptionForm';
import { PriceCard } from '@/modules/subscriptions/components/PriceCard';
import { SubscriptionLoader } from '@/modules/subscriptions/components/SubscriptionLoader';
import { YearlySwitcher } from '@/modules/subscriptions/components/YearlySwitcher';
import { SUBSCRIPTION_TITLES } from '@/modules/subscriptions/data/subscriptions';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Separator } from '@/ui/separator';

export const AccountPage = () => {
  const { user } = useUser();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const isYearly = billing === 'yearly';

  if (!user) {
    return null;
  }

  return (
    <PageTemplate
      header={{
        breadcrumbs: [],
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
          <div className={'text-xl font-semibold'}>Profile Information</div>
          {/*<Separator />*/}
          {/*<div className="flex justify-between gap-4">*/}
          {/*  <Label htmlFor="firstName" className={'shrink-0'}>*/}
          {/*    First Name*/}
          {/*  </Label>*/}
          {/*  <Input*/}
          {/*    id="firstName"*/}
          {/*    placeholder="First Name"*/}
          {/*    className={'max-w-[300px]'}*/}
          {/*    // error={Boolean(errors.title)}*/}
          {/*  />*/}
          {/*  /!*{errors.title && (*!/*/}
          {/*  /!*  <p className="text-xs text-red-700">{errors.title.message}</p>*!/*/}
          {/*  /!*)}*!/*/}
          {/*</div>*/}
          {/*<Separator />*/}
          {/*<div className="flex justify-between gap-4">*/}
          {/*  <Label htmlFor="lastName" className={'shrink-0'}>*/}
          {/*    Last Name*/}
          {/*  </Label>*/}
          {/*  <Input*/}
          {/*    id="lastName"*/}
          {/*    placeholder="Last Name"*/}
          {/*    className={'max-w-[300px]'}*/}
          {/*    // error={Boolean(errors.title)}*/}
          {/*  />*/}
          {/*  /!*{errors.title && (*!/*/}
          {/*  /!*  <p className="text-xs text-red-700">{errors.title.message}</p>*!/*/}
          {/*  /!*)}*!/*/}
          {/*</div>*/}
          {/*<Separator />*/}
          <div className="flex justify-between gap-4">
            <Label htmlFor="email" className={'shrink-0'}>
              Email
            </Label>
            <Input
              id="email"
              placeholder="Email"
              className={'max-w-[300px]'}
              disabled={true}
              value={user.email}
              // error={Boolean(errors.title)}
            />
            {/*{errors.title && (*/}
            {/*  <p className="text-xs text-red-700">{errors.title.message}</p>*/}
            {/*)}*/}
          </div>

          {/*<Separator />*/}
          {/*<Button>Save</Button>*/}
        </Card>

        <Card className={'gap-4 p-4'}>
          <div className={'text-xl font-semibold'}>Subscription</div>
          <Separator />
          <div className={'flex items-center justify-between'}>
            <div>
              You're currently using{' '}
              <strong>{SUBSCRIPTION_TITLES[user.subscription]}</strong>
            </div>

            {user.subscription !== 'business' && (
              <Button variant={'default'} asChild>
                <Link to={'/pricing'} target={'_blank'}>
                  Compare Plans
                </Link>
              </Button>
            )}
          </div>

          <SubscriptionLoader>
            {(subscription) => (
              <>
                <Separator />
                <div className={'flex items-center justify-between'}>
                  {subscription.type === 'business' ? (
                    <div>
                      <b>Unlimited</b> Projects plan
                    </div>
                  ) : (
                    <div>
                      Projects used <b>{subscription.usedProjects}</b> /{' '}
                      <b>{subscription.totalAvailableProjects}</b> projects
                    </div>
                  )}
                </div>
              </>
            )}
          </SubscriptionLoader>

          {Boolean(user.stripeCustomerId) && (
            <>
              <Separator />
              <div className={'flex items-center justify-between'}>
                <div>You can manage your subscription here</div>
                <ManageSubscriptionForm />
              </div>
            </>
          )}

          {user.subscription !== 'business' && (
            <>
              <Separator />
              <div className={'text-xl font-semibold'}>Upgrade options</div>
              <div className={'flex flex-col gap-8'}>
                <div className={'flex items-start justify-start'}>
                  <YearlySwitcher isYearly={isYearly} onChange={setBilling} />
                </div>
                <div
                  className={`grid gap-4 lg:grid-cols-${user.subscription === 'basic' ? 2 : 1}`}
                >
                  {user.subscription === 'basic' && (
                    <PriceCard
                      yearly={isYearly}
                      subscription={'pro'}
                      badges={[{ text: 'Most Popular', bg: 'bg-black' }]}
                      className={'border-black'}
                      showUpgradeForm={true}
                    />
                  )}
                  <PriceCard
                    yearly={isYearly}
                    subscription={'business'}
                    className={'border-green-500'}
                    badges={[
                      { text: 'All inclusive', bg: 'bg-green-500' },
                      { text: 'Early Launch Discount', bg: 'bg-orange-400' },
                    ]}
                    showUpgradeForm={true}
                  />
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </PageTemplate>
  );
};
