import { PageTemplate } from '@/modules/home/components/PageTemplate';
import { PricingCards } from '@/modules/subscriptions/components/PricingCards';
import { Button } from '@/ui/button';

export const PricingPage = () => {
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
            <PricingCards />

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
                      ['Step-by-step actionable plans', '✅', '✅', '✅'],
                      [
                        'Competitors analysis',
                        '1 competitor',
                        '5 competitors',
                        '10 competitors',
                      ],
                      ['Audience analysis', 'Basic', 'Advanced', 'Full'],
                      ['AI refinement & iteration', '❌', '✅', '✅'],
                      ['Priority support', '❌', '❌', '✅'],
                      // [
                      //   'Market & monetization insights',
                      //   '❌',
                      //   '❌',
                      //   '✅ (coming soon)',
                      // ],
                      ['🦊 AI Hero', '❌', '❌', '✅'],
                      [
                        'Progress tracking & reminders',
                        '❌',
                        '❌',
                        '✅ (in progress)',
                      ],
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
