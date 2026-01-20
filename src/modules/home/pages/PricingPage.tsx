import { useState } from 'react';

import { PageTemplate } from '@/modules/home/components/PageTemplate';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Label } from '@/ui/label';
import { Switch } from '@/ui/switch';

export const PricingPage = () => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  const prices = {
    free: { monthly: 0, yearly: 0 },
    pro: { monthly: 19, yearly: 190 },
    business: { monthly: 39, yearly: 390 },
  };

  const isYearly = billing === 'yearly';
  return (
    <PageTemplate>
      {(openOnboarding) => (
        <>
          <div className="">
            {/* Hero */}
            <section className="relative z-40 mx-auto max-w-5xl px-6 pt-56 pb-20 text-center text-gray-50">
              <h1 className="mb-4 text-4xl font-bold">
                Turn ideas into actionable plans — faster.
              </h1>
              <p className="mb-6 text-lg text-gray-200">
                AI-powered project planning for entrepreneurs, creators, and
                self-improvers.
              </p>

              <Button
                onClick={openOnboarding}
                size={'lg'}
                className={'px-20 py-6 text-lg font-semibold'}
              >
                Start Free — No Credit Card Required
              </Button>
            </section>

            {/* Pricing Cards */}
            <section className="relative z-40 px-6 py-12">
              <div className="mx-auto flex max-w-5xl flex-col items-center">
                {/* Billing Toggle */}
                <div className="mb-10 flex flex-row items-center justify-center gap-3 rounded-lg bg-white p-4 px-8 shadow-sm shadow-gray-400">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="airplane-mode">
                      <span
                        className={`text-sm ${!isYearly ? 'font-semibold' : 'text-gray-500'}`}
                      >
                        Monthly
                      </span>
                    </Label>
                    <Switch
                      id="airplane-mode"
                      onCheckedChange={(checked) =>
                        setBilling(checked ? 'yearly' : 'monthly')
                      }
                    />
                    <Label htmlFor="airplane-mode">
                      <span
                        className={`text-sm ${isYearly ? 'font-semibold' : 'text-gray-500'}`}
                      >
                        Yearly
                      </span>
                    </Label>
                  </div>
                  <Badge>2 months free</Badge>
                </div>

                {/* Pricing Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                  {/* Free Plan */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    <h3 className="mb-2 text-xl font-semibold">Basic</h3>
                    <p className="mb-4 text-gray-600">
                      Perfect for exploring the platform.
                    </p>
                    <p className="mb-6 text-3xl font-bold">
                      €{prices.free[billing]}
                      <span className="text-base font-medium">
                        {isYearly ? ' / year' : ' / month'}
                      </span>
                    </p>
                    <ul className="mb-6 space-y-3 text-sm text-gray-700">
                      <li>✔ 1 project plan generation</li>
                      <li>✔ Step-by-step actionable roadmaps</li>
                      <li>✔ Basic AI-generated plan</li>
                      <li>✔ Limited competitor & audience analysis</li>
                      {/*<li>✔ No phases / milestones modifications</li>*/}
                    </ul>
                  </div>

                  {/* Pro Plan */}
                  <div className="relative rounded-2xl border border-black bg-white p-8 shadow-lg">
                    <div className="absolute -top-3 right-6 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                      Most Popular
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">Pro</h3>
                    <p className="mb-4 text-gray-600">
                      For serious builders and goal achievers.
                    </p>
                    <p className="mb-1 text-3xl font-bold">
                      €{prices.pro[billing]}
                      <span className="text-base font-medium">
                        {isYearly ? ' / year' : ' / month'}
                      </span>
                    </p>
                    {isYearly && (
                      <p className="mb-6 text-sm text-gray-500">
                        Billed annually — save $38
                      </p>
                    )}
                    {!isYearly && (
                      <p className="mb-6 text-sm text-gray-500">
                        $190 / year (2 months free)
                      </p>
                    )}
                    <ul className="mb-6 space-y-3 text-sm text-gray-700">
                      <li>✔ Everything from Basic Plan</li>
                      <li>✔ Up to 5 projects</li>
                      <li>✔ Advanced AI planning</li>
                      <li>✔ Full competitor & audience analysis</li>
                      <li>✔ AI refinement & iteration</li>
                    </ul>
                  </div>

                  <div className="relative rounded-2xl border border-green-500 bg-white p-8 shadow-lg">
                    {/* Badge */}
                    <div className="absolute -top-3 right-6 flex items-center gap-2">
                      <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                        All inclusive
                      </span>
                      <span className="rounded-full bg-orange-400 px-3 py-1 text-xs font-semibold text-white">
                        Early Launch Discount
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="mb-2 text-xl font-semibold">Business</h3>
                    <p className="mb-4 text-gray-600">
                      For startups and teams looking for unlimited control and
                      insights.
                    </p>

                    {/* Pricing */}
                    <p className="mb-1 text-3xl font-bold">
                      <span className="mr-2 text-gray-400 line-through">
                        {isYearly ? '€490' : '€49'}
                      </span>
                      {isYearly
                        ? '€' + prices.business.yearly
                        : '€' + prices.business.monthly}

                      <span className="text-base font-medium">
                        {isYearly ? ' / year' : ' / month'}
                      </span>
                    </p>
                    {isYearly ? (
                      <p className="mb-6 text-sm text-gray-500">
                        Billed annually — save €100
                      </p>
                    ) : (
                      <p className="mb-6 text-sm text-gray-500">
                        Limited-time launch price
                      </p>
                    )}

                    {/* Features */}
                    <ul className="mb-6 space-y-3 text-sm text-gray-700">
                      <li>✔ Everything from Pro Plan</li>
                      <li>✔ Unlimited projects</li>
                      <li>✔ Priority Support</li>
                      <li className="text-gray-400">
                        ✔ Market & monetization insights <b>(coming soon)</b>
                      </li>
                      <li className="text-gray-400">
                        ✔ Progress tracking & reminders <b>(coming soon)</b>
                      </li>
                      <li className="text-gray-400">
                        ✔ Export options <b>(coming soon)</b>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Engagement Section */}
            <section className="mx-auto max-w-5xl px-6 py-16 text-center">
              <h2 className="mb-4 text-2xl font-semibold">
                Stay consistent. Build momentum.
              </h2>
              <p className="mx-auto max-w-2xl text-gray-600">
                Your Focus Space helps you prioritize daily tasks, guiding you
                to make steady progress on your projects. Pro users get full
                access to all planning tools and insights to keep moving forward
                efficiently.
              </p>
            </section>

            {/* Final CTA */}
            <section className="bg-primary px-6 py-16 text-center text-white">
              <h2 className="mb-4 text-2xl font-semibold">
                Ready to turn your idea into action?
              </h2>
              <div className="flex justify-center gap-4">
                <Button
                  variant={'secondary'}
                  size={'lg'}
                  className={'px-20 py-6 font-semibold'}
                  onClick={openOnboarding}
                >
                  Start Free
                </Button>
              </div>
            </section>

            {/* Comparison Table */}
            <section className="bg-gray-50 px-6 py-16">
              <div className="mx-auto max-w-5xl overflow-x-auto">
                <table className="w-full overflow-hidden rounded-xl border border-gray-200 text-sm">
                  <thead className="bg-white">
                    <tr>
                      <th className="p-4 text-left font-semibold">Feature</th>
                      <th className="p-4 text-center font-semibold">Basic</th>
                      <th className="p-4 text-center font-semibold">Pro</th>
                      <th className="p-4 text-center font-semibold">
                        Business
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      ['Active projects', '1', 'Up to 5', 'Unlimited'],
                      ['AI plan generation', 'Basic', 'Advanced', 'Advanced'],

                      [
                        'Competitor & audience analysis',
                        'Limited',
                        'Full',
                        'Full',
                      ],
                      ['Step-by-step actionable roadmaps', '✅', '✅', '✅'],
                      ['AI refinement & iteration', '❌', '✅', '✅'],
                      ['Priority support', '❌', '❌', '✅'],
                      [
                        'Market & monetization insights',
                        '❌',
                        '❌',
                        '✅ (coming soon)',
                      ],
                      [
                        'Progress tracking & reminders',
                        '❌',
                        '❌',
                        '✅ (coming soon)',
                      ],
                      ['Export options', '❌', '❌', '✅ (coming soon)'],
                    ].map(([feature, basic, pro, business]) => (
                      <tr key={feature}>
                        <td className="p-4">{feature}</td>
                        <td className="p-4 text-center">{basic}</td>
                        <td className="p-4 text-center">{pro}</td>
                        <td className="p-4 text-center">{business}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </>
      )}
    </PageTemplate>
  );
};
