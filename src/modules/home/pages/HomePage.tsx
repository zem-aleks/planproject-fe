import type { ReactNode } from 'react';

import {
  BookOpenIcon,
  CodeIcon,
  FingerprintIcon,
  GamepadIcon,
  GlobeIcon,
  MapIcon,
  MessageCircleIcon,
  RocketIcon,
  ScaleIcon,
  StoreIcon,
} from 'lucide-react';

import { PageTemplate } from '@/modules/home/components/PageTemplate';
import { Button } from '@/ui/button';

export const HomePage = () => {
  return (
    <PageTemplate>
      {(openOnboarding) => (
        <>
          <section className="relative z-40 flex items-center justify-center pt-28 pb-10 sm:pt-56 sm:pb-40">
            <div className="container mx-auto px-4">
              <div className="grid items-center gap-8 lg:grid-cols-2">
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                  <img
                    src={'/pp_logo_white.svg'}
                    alt={'logo'}
                    className="h-12"
                  />
                  <h1 className="hidden text-4xl font-bold text-pretty text-gray-50 lg:text-6xl">
                    PLAN PROJECT AI
                  </h1>
                  <h2 className={'my-1 text-xl text-gray-100 italic'}>
                    You don't need another idea. You need a plan.
                  </h2>
                  <p className="mb-8 max-w-xl text-gray-300 lg:text-xl">
                    PlanProject.ai turns messy thoughts into clear, actionable
                    project plans — so you can finally start
                  </p>
                  <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                    <Button
                      className="animate-[glow_3s_ease_infinite] px-24"
                      size={'lg'}
                      onClick={openOnboarding}
                    >
                      Try for Free
                    </Button>
                  </div>
                </div>
                <img
                  src={'/images/hero_img.png'}
                  alt={'hero image'}
                  className="max-h-96 w-full rounded-md object-contain"
                />
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center pb-20 md:pb-40">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center gap-6 text-center">
                <h3 className="text-foreground mt-6 text-3xl font-bold text-pretty lg:text-6xl">
                  How It Works
                </h3>
                <p className={'text-muted-foreground max-w-2xl text-xl italic'}>
                  AI learns everything about your project, builds a living
                  profile, and turns it into a step-by-step plan you can
                  actually follow
                </p>
                <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-12">
                  <HomeCard
                    step={1}
                    icon={<MessageCircleIcon className="size-6" />}
                    title={'Have a conversation with AI'}
                    description={`Tell AI about your idea, goals, and constraints. It asks the right questions to understand your vision — even if you don't have all the answers yet`}
                  />

                  <HomeCard
                    step={2}
                    icon={<FingerprintIcon className="size-6" />}
                    title={'AI builds your Project Profile'}
                    description={`From your conversation, AI creates a comprehensive profile: desired outcomes, workstreams, key decisions, open questions, assumptions, and constraints — all captured in one place`}
                  />

                  <HomeCard
                    step={3}
                    icon={<MapIcon className="size-6" />}
                    title={'Get a structured roadmap'}
                    description={`Your profile is transformed into phases, milestones, and daily tasks with a clear timeline. Review it, adjust if needed, and start when you're ready`}
                  />

                  <HomeCard
                    step={4}
                    icon={<RocketIcon className="size-6" />}
                    title={'Execute with AI by your side'}
                    description={`Work through daily tasks, track your progress, and chat with AI whenever you need help. It knows your entire project context and evolves with every decision you make`}
                  />
                </div>
                <Button
                  className="mt-10 animate-[glow_3s_ease_infinite] px-24"
                  size={'lg'}
                  onClick={openOnboarding}
                >
                  Try for Free
                </Button>
              </div>
            </div>
          </section>
          <section className="flex items-center justify-center pb-20 md:pb-40">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center gap-6 text-center">
                <h3 className="text-foreground text-3xl font-bold text-pretty lg:text-6xl">
                  What Can You Plan?
                </h3>
                <p className="text-muted-foreground max-w-2xl text-xl italic">
                  From side projects to ambitious ventures — if it needs a plan,
                  we've got you covered
                </p>
                <div className="mt-8 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <ExampleCard
                    icon={<ScaleIcon className="size-5" />}
                    title="I want to lose weight"
                    description="Nutrition plan, workout routine, weekly milestones, habit tracking"
                  />
                  <ExampleCard
                    icon={<GamepadIcon className="size-5" />}
                    title="I want to build a game"
                    description="Game design, engine choice, art pipeline, playtesting, release"
                  />
                  <ExampleCard
                    icon={<CodeIcon className="size-5" />}
                    title="I want to launch a SaaS"
                    description="Tech stack, MVP scope, development phases, go-to-market plan"
                  />
                  <ExampleCard
                    icon={<BookOpenIcon className="size-5" />}
                    title="I want to learn a new skill"
                    description="Learning path, resources, practice schedule, progress checkpoints"
                  />
                  <ExampleCard
                    icon={<StoreIcon className="size-5" />}
                    title="I want to start a business"
                    description="Market research, branding, supplier setup, marketing strategy"
                  />
                  <ExampleCard
                    icon={<GlobeIcon className="size-5" />}
                    title="I want to plan a big trip"
                    description="Destinations, budget, booking timeline, itinerary, packing list"
                  />
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </PageTemplate>
  );
};

const ExampleCard = ({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex items-start gap-4 rounded-xl border p-5 text-left">
      <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <h4 className="text-foreground font-semibold">{title}</h4>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
};

const HomeCard = ({
  step,
  icon,
  title,
  description,
}: {
  step: number;
  icon: ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border p-6 shadow-sm sm:p-8">
      <span className="pointer-events-none absolute -top-5 right-3 text-[140px] leading-none font-black text-neutral-500/5">
        {step}
      </span>
      <div className="relative flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
        <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl">
          {icon}
        </div>
        <h3 className="text-lg font-semibold md:text-2xl">{title}</h3>
        <p className="text-muted-foreground lg:text-lg">{description}</p>
      </div>
    </div>
  );
};
