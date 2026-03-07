import { PageTemplate } from '@/modules/home/components/PageTemplate';
import { PricingCards } from '@/modules/subscriptions/components/PricingCards';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';

export const PricingPage = () => {
  return (
    <PageTemplate>
      {(openOnboarding) => (
        <>
          <div>
            {/* Hero */}
            <section className="relative z-40 mx-auto max-w-5xl px-6 pt-56 pb-20 text-center text-gray-50">
              <h1 className="mb-4 text-4xl font-bold">
                Pick the plan that fits your ambition
              </h1>
              <p className="mb-6 text-lg text-gray-200">
                Every plan includes AI-powered project shaping, a full Project
                Profile, and a structured roadmap. Upgrade for more projects,
                deeper insights, and priority support.
              </p>

              <div className="flex flex-col items-center justify-center">
                <Button
                  onClick={openOnboarding}
                  size={'lg'}
                  className="animate-[glow_3s_ease_infinite] px-20 py-6 text-lg font-semibold"
                >
                  Start Free
                </Button>
                <Badge variant={'warning'} className="mt-4">
                  *No Credit Card Required
                </Badge>
              </div>
            </section>

            {/* Pricing Cards */}
            <PricingCards />

            {/* What's included */}
            <section className="mx-auto max-w-5xl px-6 py-16 text-center">
              <h2 className="text-foreground mb-4 text-2xl font-semibold">
                Every plan comes with an AI brain behind it
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl">
                AI shapes your project through a guided conversation, builds a
                living Project Profile with decisions, assumptions, and open
                questions, then generates a phased roadmap with daily tasks. Pro
                and Business plans unlock more projects and deeper analysis.
              </p>
            </section>

            {/* Comparison Table */}
            <section className="bg-muted px-6 py-16">
              <div className="mx-auto max-w-5xl overflow-x-auto">
                <table className="bg-background w-full overflow-hidden rounded-xl border text-sm">
                  <thead>
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
                      ['AI shaping & Project Profile', '✅', '✅', '✅'],
                      ['Phased roadmap with daily tasks', '✅', '✅', '✅'],
                      ['Context-aware AI chat', '✅', '✅', '✅'],
                      [
                        'Competitors analysis',
                        '1 competitor',
                        '5 competitors',
                        '10 competitors',
                      ],
                      ['Audience analysis', 'Basic', 'Advanced', 'Full'],
                      ['AI refinement & iteration', '❌', '✅', '✅'],
                      ['Priority support', '❌', '❌', '✅'],
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

            {/* Final CTA */}
            <section className="bg-primary px-6 py-16 text-center text-white">
              <h2 className="mb-2 text-2xl font-semibold">
                Stop planning in your head. Start building for real.
              </h2>
              <p className="mx-auto mb-6 max-w-xl text-white/80">
                Describe your idea, get a Project Profile and a roadmap in
                minutes — no credit card needed.
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  variant={'secondary'}
                  size={'lg'}
                  className="px-20 py-6 font-semibold"
                  onClick={openOnboarding}
                >
                  Start Free
                </Button>
              </div>
            </section>
          </div>
        </>
      )}
    </PageTemplate>
  );
};
