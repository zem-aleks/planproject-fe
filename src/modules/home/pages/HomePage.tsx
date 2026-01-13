import { PageTemplate } from '@/modules/home/components/PageTemplate';
import { Button } from '@/ui/button';

export const HomePage = () => {
  return (
    <PageTemplate>
      {(openOnboarding) => (
        <>
          <section className="relative z-40 flex items-center justify-center pt-56 pb-40">
            <div className="container mx-auto px-4">
              <div className="grid items-center gap-8 lg:grid-cols-2">
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                  <h1 className="my-6 text-4xl font-bold text-pretty text-gray-300 lg:text-6xl">
                    PLAN PROJECT AI
                  </h1>
                  <p className="mb-8 max-w-xl text-gray-300 lg:text-xl">
                    Platform that transforms your ideas into structured project
                    plans. Empowering you to kickstart your projects with
                    clarity and confidence. Frustrated with vague project ideas?
                    Let AI help you shape them into clear, actionable plans.
                  </p>
                  <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                    <Button
                      className="px-24"
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

          <section className="flex items-center justify-center pb-40">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center gap-6 text-center">
                <h2 className="my-6 text-3xl font-bold text-pretty lg:text-6xl">
                  How It Works
                </h2>
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                  <HomeCard
                    image={
                      'https://akmoolaxrpskmtqdymjo.supabase.co/storage/v1/object/public/assets/logo/how_it_works_11.png'
                    }
                    title={'1. Describe your idea'}
                    description={`It's a short conversation between you and AI. Try to provide as much as possible details to achieve more precise plan. If you don't have answers on some questions, don't worry. It's also could be a part of plan to explore unknown topics`}
                  />

                  <HomeCard
                    image={
                      'https://akmoolaxrpskmtqdymjo.supabase.co/storage/v1/object/public/assets/logo/how_it_works_2.png'
                    }
                    title={
                      '2. The app will analyze your input and prepare initial plan'
                    }
                    description={`It usually takes up to 1 minute to generate initial plan. It provides you insights about the project, its phases, milestones, timeline and more.`}
                  />

                  <HomeCard
                    image={
                      'https://akmoolaxrpskmtqdymjo.supabase.co/storage/v1/object/public/assets/logo/how_it_works_3.png'
                    }
                    title={'3. Start the project'}
                    description={`After the review you can start your project immediately. It will activate your roadmap and tasks.`}
                  />

                  <HomeCard
                    image={
                      'https://akmoolaxrpskmtqdymjo.supabase.co/storage/v1/object/public/assets/logo/how_it_works_4.png'
                    }
                    title={'4. Act, iterate and bring your idea to life'}
                    description={`Do daily tasks, track progress, provide feedback and your project will be done step by step.`}
                  />
                </div>
                <Button
                  className="mt-10 px-24"
                  size={'lg'}
                  onClick={openOnboarding}
                >
                  Try for Free
                </Button>
              </div>
            </div>
          </section>
        </>
      )}
    </PageTemplate>
  );
};

const HomeCard = ({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) => {
  return (
    <div key={title} className="flex gap-8 text-left">
      <div className="bg-muted size-40 shrink-0 overflow-clip rounded-xl">
        <img
          src={image}
          alt={title}
          className="aspect-square h-full w-full object-cover object-center"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold md:text-2xl">{title}</h3>
        <p className="text-muted-foreground lg:text-lg">{description}</p>
      </div>
    </div>
  );
};
