import { useState } from 'react';

import { PriceCard } from '@/modules/subscriptions/components/PriceCard';
import { YearlySwitcher } from '@/modules/subscriptions/components/YearlySwitcher';

export const PricingCards = () => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const isYearly = billing === 'yearly';

  return (
    <section className="relative z-40 px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        <YearlySwitcher isYearly={isYearly} onChange={setBilling} />

        {/* Pricing Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <PriceCard yearly={isYearly} subscription={'basic'} badges={[]} />
          <PriceCard
            yearly={isYearly}
            subscription={'pro'}
            badges={[{ text: 'Most Popular', bg: 'bg-black' }]}
            className={'border-black'}
          />
          <PriceCard
            yearly={isYearly}
            subscription={'business'}
            className={'border-green-500'}
            badges={[
              { text: 'All inclusive', bg: 'bg-green-500' },
              { text: 'Early Launch Discount', bg: 'bg-orange-400' },
            ]}
          />
        </div>
      </div>
    </section>
  );
};
